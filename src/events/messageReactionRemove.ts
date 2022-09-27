import { MessageReaction, User } from 'discord.js'
import { client } from '..'
import { Channel } from '../constants/Channel'
import { Emoji, watchedEmotes } from '../constants/Emoji'
import { Guild } from '../constants/Guild'
import { Role } from '../constants/Role'
import { logError } from '../utils/functions'

export const action = async (reaction: MessageReaction, user: User): Promise<void> => {
    if (reaction.partial)
        await reaction.fetch().catch(logError)

    if (!watchedEmotes.includes(reaction.emoji.identifier)) {
        // Prevent unneccesary fetching of data.
        return
    }
    if (reaction.message.partial)
        await reaction.message.fetch().catch(logError)

    if (user.id === undefined)
        await user.fetch().catch(logError)


    let guildMember
    try {
        const guild = await client.guilds.fetch(Guild.Wynntils)
        guildMember = await guild.members.fetch(user.id)
    } catch (err) {
        logError(err)
    }

    if (guildMember) {
        if (reaction.message.channel.id === Channel.Self_Roles) {
            if (reaction.emoji.identifier === Emoji.ARROWS_COUNTERCLOCKWISE)
                guildMember.roles.remove(Role.ModUpdates, 'Reacted in #self-roles').catch(logError)
            if (reaction.emoji.identifier === Emoji.ROCKET)
                guildMember.roles.remove(Role.ArtemisUpdates, 'Reacted in #self-roles').catch(logError)

        }
    } else
        logError(Error(`Unable to find user (${user.id}) in Wynntils Discord server.`))

}
