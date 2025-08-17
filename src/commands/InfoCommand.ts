import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import { WynntilsBaseCommand } from "../classes/WynntilsCommand";
import { logError, buildLoadingContainer } from "../utils/functions";
import {
  fetchBuffer,
  getFirstFramePNG,
  buildCapeGif,
} from "../utils/gif";
import { AthenaAPI } from "../api/AthenaAPI";
import { WynncraftAPI } from "../api/WynncraftAPI";
import { UserInfo } from "../interfaces/api/athena/UserInfo";
import { Staff } from "../constants/Role";

const athena = new AthenaAPI(process.env.ATHENA_API_KEY ?? "");
const wynn = new WynncraftAPI();

export class InfoCommand extends WynntilsBaseCommand {
  constructor(client: Client) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("info")
        .setDescription("Returns user info")
        .addStringOption((opt) =>
          opt
            .setName("user")
            .setDescription("MC username or UUID")
            .setRequired(true)
        ) as SlashCommandBuilder,
      { helpText: "Returns user info", roles: Staff }
    );
  }

  public async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const usernameOrUuid = interaction.options.getString("user", true);

    await interaction.reply({
      components: [buildLoadingContainer(usernameOrUuid)],
      flags: MessageFlags.IsComponentsV2,
    });

    let userInfo: UserInfo;
    try {
      userInfo = await athena.getUser(usernameOrUuid);
    } catch (err) {
      await logError(err);
      const errorContainer = new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              "## Oops! Error D;",
              ":x: Something went wrong while fetching the user info.",
              "-# Try again in a moment, or check the username/UUID.",
            ].join("\n")
          )
        );

      await interaction.editReply({
        components: [errorContainer],
        flags: MessageFlags.IsComponentsV2,
        files: [],
      });
      return;
    }

    let guildLine = "No guild";
    try {
      const id = userInfo.uuid || usernameOrUuid
      guildLine = await wynn.getGuildLine(id)
    } catch {
    }

    // ---- View model ----
    const isElytra = Boolean(userInfo?.cosmetics?.isElytra);
    const isCape =
      userInfo?.cosmetics?.isElytra == null
        ? false
        : !userInfo.cosmetics.isElytra;
    const textureID = userInfo?.cosmetics?.texture ?? null;

    const cosmeticInfo =
      `Cape:   ${isCape ? "🟩" : "🟥"}\n` + `Elytra: ${isElytra ? "🟩" : "🟥"}`;

    const usedVals = Object.values(userInfo?.versions?.used ?? {}) as number[];
    const lastActive = usedVals.length
      ? Math.floor(Math.max(...usedVals) / 1000)
      : undefined;

    // ---- Builders ----
    const header = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `## User Info for \`${userInfo.username}\``,
            `${userInfo.accountType}\n`,
            `-# UUID: ${userInfo.uuid}`,
          ].join("\n")
        )
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
          `https://minotar.net/helm/${userInfo.uuid}/100.png`
        )
      );

    const mainInfo = new TextDisplayBuilder().setContent(
      `**Latest Version:** ${userInfo.versions.latest}\n` +
        `**Last Online:** ${lastActive ? `<t:${lastActive}:R>` : "Unknown"}\n` +
        `**Discord:** ${
          userInfo.discord.id ? `<@${userInfo.discord.id}>` : "Not linked"
        }\n` +
        `**Guild:** ${guildLine}`
    );

    const cosmetics = new TextDisplayBuilder().setContent(
      "**Cosmetics**\n" + cosmeticInfo
    );

    const buildBaseContainer = () =>
      new ContainerBuilder()
        .addSectionComponents(header)
        .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
        .addTextDisplayComponents(mainInfo)
        .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
        .addTextDisplayComponents(cosmetics);

    const capeURL = textureID
      ? `https://athena.wynntils.com/capes/get/${textureID}`
      : null;
    if (capeURL) {
      try {
        const sheet = await fetchBuffer(capeURL);
        const { buffer: firstFramePng, meta } = await getFirstFramePNG(
          sheet,
          1024
        );
        const frameCount = meta.frameCount;

        const firstAttachmentName = "cape.png";
        const firstFiles = [
          new AttachmentBuilder(firstFramePng).setName(firstAttachmentName),
        ];

        const firstContainer = buildBaseContainer().addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
              .setURL(`attachment://${firstAttachmentName}`)
              .setDescription(
                frameCount > 1 ? `Cape (frame 1 of ${frameCount})` : "Cape"
              )
          )
        );

        await interaction.editReply({
          components: [firstContainer],
          files: firstFiles,
          flags: MessageFlags.IsComponentsV2,
        });

        if (frameCount > 1) {
          try {
            const { buffer: gifBuf } = await buildCapeGif(sheet, {
              targetWidth: 1024,
              delayMs: 80,
              loop: 0,
              quality: 10,
            });

            const gifName = "cape.gif";
            const gifContainer = buildBaseContainer().addMediaGalleryComponents(
              new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder()
                  .setURL(`attachment://${gifName}`)
                  .setDescription("Cape (animated)")
              )
            );

            await interaction.editReply({
              components: [gifContainer],
              files: [new AttachmentBuilder(gifBuf).setName(gifName)],
              flags: MessageFlags.IsComponentsV2,
            });
          } catch (e) {
            await logError(e);
            // leave the first-frame reply as-is
          }
        }
        return;
      } catch (e) {
        await logError(e);
        // fall through to reply without gallery
      }
    }

    // No texture or failed to load → reply without media gallery
    const container = buildBaseContainer();
    await interaction.editReply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  }
}
