import consola from "consola";
import { TextChannel, ThreadChannel } from "discord.js";
import { logError, styledEmbed } from "../utils/functions";

export const action = async (thread: ThreadChannel): Promise<void> => {
    try {
        const logChannel = thread.guild.channels.cache.find(c => c.name === "server-logs") as TextChannel
        const embed = styledEmbed()
        embed.setColor(0x72ed9e)
        embed.setTitle("Thread Notification")
        embed.setDescription("An thread has been created.")
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
                name: 'Created at',
                value: `<t:${Math.floor(thread.createdTimestamp / 1000)}:R>`,
                inline: true
            },
        ])

        thread.join();
        
        logChannel.send({embeds: [embed.toJSON()]})
        consola.success(`Joined thread ${thread.name}`);
    } catch(err: any){
        consola.error(`Failed to join thread ${thread.name}: ${err}`)
        logError(err);
    }
}