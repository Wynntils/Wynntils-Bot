import { EmbedBuilder } from 'discord.js'

export interface DMOptions {
    userId: string,
    content?: string,
    embed?: EmbedBuilder
}
