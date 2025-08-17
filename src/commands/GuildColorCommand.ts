import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
} from 'discord.js'
import { WynntilsBaseCommand } from '../classes/WynntilsCommand'
import { buildLoadingContainer } from '../utils/functions'
import { guildColorService, GuildColorService } from '../services/GuildColorService'
import { normalizeHex } from '../utils/color'
import { findClosest, isAllowed } from '../utils/wynncolor'
import { buildTerritoryPanelImage } from '../utils/wynncolor'
import consola from 'consola'

const buildErrorContainer = (lines: string[]) =>
  new ContainerBuilder()
    .setAccentColor(Colors.Red)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines.join('\n')))

const buildResultContainer = (opts: {
  inputHex: string
  normalizedHex: string
  allowed: boolean
  closestLabel?: string
  closestHex?: string
  closestPrefix?: string
  delta?: number
}) => {
  const { inputHex, normalizedHex, allowed, closestLabel, closestHex, closestPrefix, delta } = opts

  const header = new TextDisplayBuilder().setContent(
    [
      '## Guild Color Check',
      `-# Input: \`${inputHex}\``,
      `-# Normalized: \`${normalizedHex}\``,
    ].join('\n'),
  )

  const verdict = new TextDisplayBuilder().setContent(
    [
      `**Allowed?** ${allowed ? '🟩 Yes' : '🟥 No'}`,
      closestHex
        ? `**Closest:** ${closestLabel} [${(closestPrefix ?? '').toUpperCase()}] (\`${closestHex}\`${typeof delta === 'number' ? `, ΔE ${delta.toFixed(2)}` : ''})`
        : '**Closest:** Unknown',
      '',
    ].join('\n'),
  )

  return new ContainerBuilder()
    .setAccentColor(allowed ? Colors.Green : Colors.Red)
    .addTextDisplayComponents(header)
    .addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(verdict)
}

export class GuildColorCommand extends WynntilsBaseCommand {
  constructor(client: Client) {
    super(
      client,
      new SlashCommandBuilder()
        .setName('guildcolor')
        .setDescription('Check a hex color against existing guilds and render a territory-style preview')
        .addStringOption(o =>
          o.setName('hex')
            .setDescription('Hex color, e.g. #33AA77 or 33AA77')
            .setRequired(true),
        )
        .addStringOption(o =>
          o.setName('prefix')
            .setDescription('Your guild tag/prefix to render (optional, default: TAG)')
            .setRequired(false),
        ) as SlashCommandBuilder,
      { helpText: 'Validates a color against current guild colors and renders a territory overlay preview.' },
    )
  }

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const userHexRaw = interaction.options.getString('hex', true)

    // Loading
    await interaction.reply({
      components: [buildLoadingContainer('Checking color…')],
      flags: MessageFlags.IsComponentsV2,
    })

    try {
      const normalized = normalizeHex(userHexRaw)
      if (!normalized) {
        const err = buildErrorContainer([
          '## Invalid color',
          ':x: Please provide a valid hex like `#AABBCC` or `#ABC`.',
        ])
        await interaction.editReply({ components: [err], flags: MessageFlags.IsComponentsV2 })
        return
      }

      const palette = await guildColorService.get();

      const { closest, distance } = findClosest(normalized, palette)
      const { allowed } = isAllowed(normalized, palette)

      const png = await buildTerritoryPanelImage({
        colorHex: normalized,
        prefix: closest.prefix,
        panelSize: 0.82,
        borderWidth: 6,
        alpha: 0.35,
      })

    
      const container = buildResultContainer({
        inputHex: userHexRaw,
        normalizedHex: normalized,
        allowed,
        closestLabel: closest?.prefix,
        closestHex: closest?.color,
        closestPrefix: closest?.prefix,
        delta: distance,
      })

      const attachmentName = 'territory-preview.png'
      const withPreview = container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder()
            .setURL(`attachment://${attachmentName}`)
            .setDescription('Territory preview'),
        ),
      )

      await interaction.editReply({
        components: [withPreview],
        files: [new AttachmentBuilder(png).setName(attachmentName)],
        flags: MessageFlags.IsComponentsV2,
      })
    } catch (e) {
      consola.error(e)
      const err = buildErrorContainer([
        '## Oops!',
        ':x: Failed to check the color or render the preview.',
      ])
      await interaction.editReply({ components: [err], flags: MessageFlags.IsComponentsV2 })
    }
  }
}
