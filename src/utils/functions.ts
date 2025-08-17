import {
  GuildBasedChannel,
  Colors,
  EmbedBuilder,
  TextChannel,
  ChannelType,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { client } from "../index";
import { inspect } from "util";
import consola from "consola";
import { DMOptions } from "../constants/types/DMOptions";
import semver from "semver";

const toError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  if (typeof err === "string") return new Error(err);
  try {
    return new Error(inspect(err, { depth: 3 }));
  } catch {
    return new Error(String(err));
  }
};
const truncate = (s: string, max: number) =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

export const styledEmbed: () => EmbedBuilder = () => {
  return new EmbedBuilder()
    .setFooter({
      text: client.user?.username ?? "Wynntils",
      iconURL: client.user?.avatarURL() ?? client.user?.defaultAvatarURL,
    })
    .setTimestamp(Date.now());
};

export const buildLoadingContainer = (who: string) =>
  new ContainerBuilder()
    .setAccentColor(Colors.Green)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
          [
            `## Looking up \`${who}\``,
            "🔄 Fetching user info from Athena…",
            "-# I’ll update this message when everything is ready.",
          ].join("\n")
        )
    );

export const logError = async (err: unknown) => {
  const error = toError(err);
  consola.error(error);

  // Build a safe description (4096 char limit on embed description)
  const stackBlock = error.stack
    ? `\n\`\`\`\n${truncate(error.stack, 3800)}\n\`\`\``
    : "";
  const description = truncate(
    `**${error.name ?? "Error"}**: ${
      error.message ?? "(no message)"
    }${stackBlock}`,
    4096
  );

  for (const [, guild] of client.guilds.cache) {
    const channel = guild.channels.cache.find(
      (c: GuildBasedChannel): c is TextChannel =>
        c.type === ChannelType.GuildText && c.name === "console-log"
    );
    if (!channel) continue;

    const embed = styledEmbed()
      .setColor(Colors.Red)
      .setTitle("An error occurred with the bot")
      .setDescription(description);

    await channel.send({ embeds: [embed] }).catch(consola.error);
  }
};

export const logReady: () => void = async () => {
  for (const guild of client.guilds.cache) {
    const channel = guild[1].channels.cache.find(
      (c: GuildBasedChannel) => c.name === "console-log"
    ) as TextChannel;

    if (!channel) continue;

    const embed = styledEmbed()
      .setColor(Colors.Green)
      .setTitle("Update")
      .setDescription("The bot has just started.");

    await channel.send({ embeds: [embed] }).catch(consola.error);
  }
};

export const dmUser: ({ userId, content, embed }: DMOptions) => void = async ({
  userId,
  content,
  embed,
}: DMOptions) => {
  const user = await client.users.cache.find((u) => u.id === userId);
  if (user) {
    try {
      const dm = await user.createDM();
      await dm.send({
        content: content ?? undefined,
        embeds: embed ? [embed] : undefined,
      });
    } catch (e) {
      logError(e);
    }
  }
};

export const logPunishment: (embed: EmbedBuilder) => void = async (
  embed: EmbedBuilder
) => {
  for (const guild of client.guilds.cache) {
    const channel = guild[1].channels.cache.find(
      (c: GuildBasedChannel) => c.name === "server-logs"
    ) as TextChannel;

    if (!channel) continue;

    await channel.send({ embeds: [embed] }).catch(consola.error);
  }
};

export function parseSince(input?: string | null): number {
  if (!input || !input.trim()) {
    return Date.now() - 30 * 24 * 60 * 60 * 1000
  }
  if (/^\d+$/.test(input)) return Number(input)
  const t = Date.parse(input)
  if (Number.isFinite(t)) return t
  throw new Error('Invalid `since` value. Use ms since epoch or a valid date string.')
}

export function inVersionRange(v: string, min?: string | null, max?: string | null): boolean {
  if (min && !semver.valid(min)) return false
  if (max && !semver.valid(max)) return false
  if (min && semver.lt(v, min)) return false
  if (max && semver.gt(v, max)) return false
  return true
}