import { MessageEmbed } from 'discord.js'

export interface DMOptions {
    userId: string,
    content?: string,
    embed ?: MessageEmbed
}
