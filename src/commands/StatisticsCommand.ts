// src/commands/StatisticsCommand.ts
import {
  ChatInputCommandInteraction,
  Client,
  Colors,
  ContainerBuilder,
  MessageFlags,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { WynntilsBaseCommand } from "../classes/WynntilsCommand";
import { MongoService } from "../services/MongoService";
import {
  buildLoadingContainer,
  parseSince,
  inVersionRange,
} from "../utils/functions";
import semver from "semver";
import consola from "consola";

const EXTRACT_RE = /^Av(\d+\.\d+\.\d+)\s+(FABRIC|FORGE)$/;

const buildErrorContainer = (lines: string[]) =>
  new ContainerBuilder()
    .setAccentColor(Colors.Red)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(lines.join("\n"))
    );

const buildStatsContainer = (opts: {
  sinceMs: number;
  min?: string | null;
  max?: string | null;
  totalUsers: number;
  activeSince: number;
  fabric: number;
  forge: number;
  unknown: number;
  topTable?: string;
  hasFilter: boolean;
  matching: number;
}) => {
  const {
    sinceMs,
    min,
    max,
    totalUsers,
    activeSince,
    fabric,
    forge,
    unknown,
    topTable,
    hasFilter,
    matching,
  } = opts;

  const header = new TextDisplayBuilder().setContent(
    [
      "## Athena Statistics",
      `-# Since: <t:${Math.floor(sinceMs / 1000)}:f>`,
      hasFilter
        ? `-# Filter: ${min ? `Av${min}` : "Av*"} → ${max ? `Av${max}` : "Av*"}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  const totals = new TextDisplayBuilder().setContent(
    [
      `**Total users:** ${totalUsers.toLocaleString()}`,
      `**Active since:** ${activeSince.toLocaleString()}`,
      hasFilter ? `**Matching (in range):** ${matching.toLocaleString()}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  const fTotal = Math.max(
    1,
    hasFilter ? fabric + forge : fabric + forge + unknown
  ); // avoid /0
  const fPct = ((fabric / fTotal) * 100).toFixed(2);
  const nPct = ((forge / fTotal) * 100).toFixed(2);
  const uPct = hasFilter ? null : ((unknown / fTotal) * 100).toFixed(2);

  const platform = new TextDisplayBuilder().setContent(
    [
      "**Platform split**" + (hasFilter ? " (matching)" : " (active)"),
      `• FABRIC: ${fabric.toLocaleString()} (${fPct}%)`,
      `• NEOFORGE: ${forge.toLocaleString()} (${nPct}%)`,
      !hasFilter ? `• Unknown: ${unknown.toLocaleString()} (${uPct}%)` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  const top = topTable
    ? new TextDisplayBuilder().setContent("**Split by versions**\n" + topTable)
    : null;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(header)
    .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(totals)
    .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(platform);

  if (top) {
    container
      .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
      .addTextDisplayComponents(top);
  }

  return container;
};

export class StatisticsCommand extends WynntilsBaseCommand {
  constructor(client: Client) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("statistics")
        .setDescription(
          "Athena user statistics (optionally between two Av versions)"
        )
        .addStringOption((o) =>
          o
            .setName("since")
            .setDescription(
              "Only include users active after this (ms since epoch or ISO date). Default: 30d"
            )
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName("min")
            .setDescription("Min Av version (e.g. 2.4.10). Optional")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName("max")
            .setDescription("Max Av version (e.g. 2.4.18). Optional")
            .setRequired(false)
        ) as SlashCommandBuilder,
      {
        helpText:
          "Shows user counts, optional version-range filter, platform split, and top Av versions",
      }
    );
  }

  public async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.reply({
      components: [buildLoadingContainer("statistics")],
      flags: MessageFlags.IsComponentsV2,
    });

    try {
      const sinceMs = parseSince(interaction.options.getString("since"));
      const min = interaction.options.getString("min");
      const max = interaction.options.getString("max");

      if ((min && !semver.valid(min)) || (max && !semver.valid(max))) {
        const err = buildErrorContainer([
          "## Oops!",
          ":x: `min`/`max` must be valid semver like `2.4.10`.",
        ]);
        await interaction.editReply({
          components: [err],
          flags: MessageFlags.IsComponentsV2,
        });
        return;
      }

      const usersCol = await MongoService.instance().getCollection(
        "users",
        "Athena"
      );

      // High-level counts
      const [totalUsers, activeSince] = await Promise.all([
        usersCol.estimatedDocumentCount(),
        usersCol.countDocuments({ lastActivity: { $gt: sinceMs } }),
      ]);

      // Stream active users and aggregate with optional version bounds
      const cursor = usersCol.find(
        { lastActivity: { $gt: sinceMs }, latestVersion: { $type: "string" } },
        { projection: { latestVersion: 1 } }
      );

      let fabric = 0;
      let forge = 0;
      let unknown = 0;

      
      const versionSplits = new Map<string, { FABRIC: number; FORGE: number }>();

      for await (const doc of cursor) {
        const versionString = (doc as any).latestVersion as string;
        const modLoaderMatch = EXTRACT_RE.exec(versionString);
        if (!modLoaderMatch) {
          unknown++;
          continue;
        }
        const [, ver, platform] = modLoaderMatch;
        if (!inVersionRange(ver, min, max)) continue;

        const split = versionSplits.get(ver) ?? { FABRIC: 0, FORGE: 0 };
        if (platform === "FABRIC") {
          split.FABRIC++;
          fabric++;
        } else {
          split.FORGE++;
          forge++;
        }
        versionSplits.set(ver, split);
      }

      const matching = fabric + forge;
      const hasFilter = Boolean(min || max);

    
      const allVersionsSorted = [...versionSplits.entries()].sort((a, b) =>
        semver.compare(a[0], b[0])
      );

      const PREVIEW_LIMIT = 20;
      const preview = allVersionsSorted.slice(0, PREVIEW_LIMIT);

      const headers = [
        "Version",
        "FABRIC",
        "NEOFORGE",
        "Total",
        "FABRIC (%)",
        "NEOFORGE (%)",
      ] as const;

      type Row = Record<(typeof headers)[number], string | number>;

      const rows: Row[] = preview.map(([ver, { FABRIC, FORGE }]) => {
        const Total = FABRIC + FORGE;
        const fPct = Total ? ((FABRIC / Total) * 100).toFixed(2) : "0.00";
        const nPct = Total ? ((FORGE / Total) * 100).toFixed(2) : "0.00";
        return {
          Version: ver,
          FABRIC,
          NEOFORGE: FORGE,
          Total,
          "FABRIC (%)": fPct,
          "NEOFORGE (%)": nPct,
        };
      });

    
      if (unknown > 0) {
        rows.push({
          Version: "Unknown",
          FABRIC: 0,
          NEOFORGE: 0,
          Total: unknown,
          "FABRIC (%)": "—",
          "NEOFORGE (%)": "—",
        });
      }

      const widths = headers.map((h) =>
        Math.max(h.length, ...rows.map((r) => String(r[h]).length))
      );
      const pad = (s: string | number, i: number) =>
        String(s).padEnd(widths[i]);

      const codeTable =
        rows.length > 0
          ? "```\n" +
            [
              headers.map((h, i) => pad(h, i)).join(" | "),
              headers.map((_, i) => "-".repeat(widths[i])).join("-|-"),
              ...rows.map((r) =>
                headers.map((h, i) => pad(r[h], i)).join(" | ")
              ),
            ].join("\n") +
            "\n```"
          : "_No versions to display._";

      const moreNote =
        allVersionsSorted.length > PREVIEW_LIMIT
          ? `\n…and **${
              allVersionsSorted.length - PREVIEW_LIMIT
            }** more versions not shown.`
          : "";

    
      const summaryLine =
        `Totals — FABRIC: ${fabric.toLocaleString()} • ` +
        `NEOFORGE: ${forge.toLocaleString()} • ` +
        `Unknown: ${unknown.toLocaleString()} • ` +
        `All: ${(fabric + forge + unknown).toLocaleString()}`;

      const topBlock = [summaryLine, codeTable, moreNote]
        .filter(Boolean)
        .join("\n");

      
      const statsContainer = buildStatsContainer({
        sinceMs,
        min,
        max,
        totalUsers,
        activeSince,
        fabric,
        forge,
        unknown,
        topTable: topBlock,
        hasFilter,
        matching,
      });

      await interaction.editReply({
        components: [statsContainer],
        flags: MessageFlags.IsComponentsV2,
      });
    } catch (e) {
      await consola.error(e);
      const err = buildErrorContainer([
        "## Oops! Error D;",
        ":x: Failed to compute statistics.",
        "-# Please try again shortly.",
      ]);
      await interaction.editReply({
        components: [err],
        flags: MessageFlags.IsComponentsV2,
      });
    }
  }
}
