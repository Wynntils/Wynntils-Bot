import { MessageEmbed } from 'discord.js';

const staffOnlyEmbed = new MessageEmbed()
    .setColor(15158332)
    .setTitle(':x: Insufficient Permissions')
    .setDescription('This command is for staff members only');

export { staffOnlyEmbed };
