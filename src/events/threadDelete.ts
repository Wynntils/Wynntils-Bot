import consola from "consola";
import { TextChannel, ThreadChannel } from "discord.js";
import { logError, styledEmbed } from "../utils/functions";

export const action = async (thread: ThreadChannel) => {
    try {
        const logChannel = thread.guild.channels.cache.find(c => c.name === "server-logs") as TextChannel
        const embed = styledEmbed()
        
        embed.setTitle("Thread Notification")
        embed.setDescription("A thread has been closed")
        embed.addFields([
            {
                name: 'Name',
                value: thread.name,
                inline: true
            },
            {
                name: 'Owner',
                value: `<@${thread.ownerId}>`,
                inline: true
            },
            {
                name: 'Closed at',
                value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                inline: true
            },
        ])
        logChannel.send({embeds: [embed.toJSON()]})
    } catch (err: any) {
        consola.error(err)
        logError(err)
    }
}