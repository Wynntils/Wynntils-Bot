import { DiscordAPIError, DMChannel, GuildMember, TextChannel } from 'discord.js'
import { Channel } from '../constants/Channel'
import { DonatorRoles } from '../constants/Role'
import { logError } from '../utils/functions'

export const action = (oldMember: GuildMember, newMember: GuildMember): void => {
    if (oldMember.roles.cache.size === newMember.roles.cache.size)
        return
    // Roles didn't change
    if (!DonatorRoles.some(r => newMember.roles.cache.has(r)))
        return
    // Didn't become donator
    if (DonatorRoles.some(r => oldMember.roles.cache.has(r)))
        return
    // Was already donator

    const msg = `Hey ${newMember.user.username}, thanks for supporting the project! Please provide us your in-game username in <#${Channel.Donator_Lounge}>, and someone will apply your donor tag in-game within 12 hours.`

    newMember.createDM().then((dm: DMChannel) => {
        dm.send(msg).catch(logError)
    }).catch((error: DiscordAPIError) => {
        const donatorLounge = newMember.guild.channels.resolve(Channel.Donator_Lounge) as TextChannel
        donatorLounge.send(msg).catch(logError)
    })
}
