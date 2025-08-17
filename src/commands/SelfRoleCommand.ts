
import { ChatInputCommandInteraction, Client, SlashCommandBuilder, Colors, EmbedBuilder } from 'discord.js';
import { logError } from '../utils/functions';
import { WynntilsBaseCommand } from '../classes/WynntilsCommand';

export class SelfRoleCommand extends WynntilsBaseCommand {
    constructor(client: Client) {
        super(
            client,
            (new SlashCommandBuilder()
                .setName('selfrole')
                .setDescription('Toggle a self-assignable role')
                .addStringOption(option =>
                    option.setName('role')
                        .setDescription('Role to toggle')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Development Updates', value: 'Development Updates' },
                            { name: 'Artemis Development Updates', value: 'Artemis Development Updates' }
                        )
                )) as SlashCommandBuilder,
            { helpText: 'Toggle a self-assignable role' }
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const roleName = interaction.options.getString('role', true);
        const guild = interaction.guild;
        if (!guild)  {
            interaction.reply({ content: 'This command can only be used in a server.', flags: ['Ephemeral'] });
        };

        let member;
        try {
            member = await guild.members.fetch(interaction.user.id);
        } catch {
            interaction.reply({ content: 'Could not fetch your member data.', flags: ['Ephemeral'] });
        }

        const role = guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(':x: Oops! Error D;')
                        .setDescription(`Role \`${roleName}\` not found in server.`)
                ],
                flags: ['Ephemeral']
            });
        }

        let action: 'add' | 'remove';
        let successMsg: string;
        let errorMsg: string;
        if (!member.roles.cache.has(role.id)) {
            action = 'add';
            successMsg = 'Successfully given you the role.';
            errorMsg = 'Ran into an error while applying the role to you.';
        } else {
            action = 'remove';
            successMsg = 'Successfully removed the role from you.';
            errorMsg = 'Ran into an error while removing the role from you.';
        }

        try {
            if (action === 'add') {
                await member.roles.add(role);
            } else {
                await member.roles.remove(role);
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle('Success!')
                        .setDescription(successMsg)
                ],
                flags: ['Ephemeral']
            });
        } catch (err) {
            logError(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(':x: Oops! Error D;')
                        .setDescription(errorMsg)
                ],
                flags: ['Ephemeral']
            });
        }
    }
}
