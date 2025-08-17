
import { WynntilsBaseCommand } from '../classes/WynntilsCommand';
import { Colors } from '../constants/Colors';
import { SlashCommandBuilder, ChatInputCommandInteraction, Client, Collection, EmbedBuilder } from 'discord.js';


export class HelpCommand extends WynntilsBaseCommand {
    private commands: Collection<string, WynntilsBaseCommand>;

    constructor(client: Client, commands: Collection<string, WynntilsBaseCommand>) {
        super(
            client,
            (new SlashCommandBuilder()
                .setName('help')
                .setDescription('Shows the help menu')
                .addStringOption(option =>
                    option.setName('command')
                        .setDescription('What command to see the help information for')
                        .setRequired(false)
                ) as SlashCommandBuilder),
            { helpText: 'Shows the help menu' }
        );
        this.commands = commands;
    }


    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const commandName = interaction.options.getString('command');
        if (!commandName) {
            // List all commands
            const fields = [
                {
                    name: 'Commands:',
                    value: this.commands
                        .filter(cmd => !cmd.hasPermission || cmd.hasPermission(interaction))
                        .map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`)
                        .join('\n') || 'No commands found.'
                }
            ];
            const embed = new EmbedBuilder()
                .setTitle('Wynntils Help Commands')
                .addFields(fields)
                .setColor(Colors.GREEN);
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const command = this.commands.get(commandName);
        if (!command) {
            await interaction.reply({ content: `Command \"/${commandName}\" not found.`, ephemeral: true });
            return;
        }
        if (command.hasPermission && !command.hasPermission(interaction)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Help: /' + commandName)
            .setDescription(command.helpText)
            .setColor(Colors.GREEN);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
