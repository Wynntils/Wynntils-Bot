


import { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, Colors, ApplicationCommandOptionChoiceData } from 'discord.js';
import { WynntilsBaseCommand } from '../classes/WynntilsCommand';

export class FaqCommand extends WynntilsBaseCommand {
    constructor(client: Client, choices: ApplicationCommandOptionChoiceData<string>[]) {
        const builder = new SlashCommandBuilder()
            .setName('faq')
            .setDescription('Provides information on frequently asked questions')
            .addStringOption(option =>
                option.setName('value')
                    .setDescription('Name of FAQ entry')
                    .setRequired(true)
                    .addChoices(...choices)
            );
        super(
            client,
            builder as SlashCommandBuilder,
            { helpText: 'Provides information on frequently asked questions' }
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const value = interaction.options.getString('value', true);
        const faq = (await (await import('../services/FaqService')).faqService.get()).get(value);

        const embed = new EmbedBuilder()
            .setFooter({ text: `By: ${interaction.user.tag} - Please read #faq` });

        if (faq) {
            embed.setColor(Colors.Green)
                .setAuthor({ name: 'Wynntils FAQ', iconURL: this.client.user?.avatarURL() ?? this.client.user?.defaultAvatarURL })
                .addFields({ name: faq.title, value: faq.value });
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        embed.setColor(Colors.Red)
            .setTitle(':x: Invalid Entry')
            .setDescription(`Unable to find entry for ${value}.`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
