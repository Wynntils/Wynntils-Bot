
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { WynntilsBaseCommand } from '../classes/WynntilsCommand';

export class PingCommand extends WynntilsBaseCommand {
    constructor(client: Client) {
        super(
            client,
            (new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Command to check whether the bot is still operational')) as SlashCommandBuilder,
            { helpText: 'Command to check whether the bot is still operational' }
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply({ content: 'Pong! :ping_pong:', flags: ['Ephemeral'] });
    }
}
