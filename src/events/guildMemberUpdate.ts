import { DiscordAPIError, DMChannel, GuildMember, TextChannel } from 'discord.js'
import { Channel } from '../constants/Channel'
import { DonatorRoles } from '../constants/Role'
import { logError } from '../utils/functions'

export const action = (oldMember: GuildMember, newMember: GuildMember): void => {
    if (oldMember.roles.cache.size === newMember.roles.cache.size)
        return
    // Roles didn't change
    if (!DonatorRoles.some(dr => newMember.roles.cache.some(r => r.name === dr)))
        return
    // Didn't become donator
    if (DonatorRoles.some(dr => oldMember.roles.cache.some(r => r.name === dr)))
        return
    // Was already donator

    const msg = `Hey <@${newMember.user.id}>, thanks for supporting the project! Please provide us your in-game username in <#${Channel.Donator_Lounge}>, and someone will apply your donor tag in-game within 12 hours.`
    const msgInDonatorLounge = `Hey <@${newMember.user.id}>, thanks for supporting the project! Please provide us your in-game username in this channel, and someone will apply your donor tag in-game within 12 hours.`

    newMember.createDM().then((dm: DMChannel) => {
        dm.send(msg).catch((error: DiscordAPIError) => {
            const donatorLounge = newMember.guild.channels.cache.find(c => c.name === 'donator-lounge') as TextChannel
            donatorLounge.send(msgInDonatorLounge).catch(logError)
        })
    }).catch(logError)
}
