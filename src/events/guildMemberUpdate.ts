import { DiscordAPIError, DMChannel, GuildMember, TextChannel } from 'discord.js'
import { Channel } from '../constants/Channel'
import { DonatorRoles } from '../constants/Role'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'

export const action = async (oldMember: GuildMember, newMember: GuildMember): Promise<void> => {

    const serverLogChannel = oldMember.guild.channels.cache.find(c => c.name === 'server-logs') as TextChannel

    const logEmbed = styledEmbed()
        .setAuthor({ name: `${newMember.displayName} (${newMember.user.id})`, iconURL: newMember.user.avatarURL() })

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        // Role added
        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first()
            logEmbed
                .setColor(Colors.GREEN)
                .setTitle('Role Added')
                .setDescription(`<@&${role.id}>`)

            serverLogChannel.send({ embeds: [logEmbed.toJSON()] })
        }

        // Role removed
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            const role = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first()
            logEmbed
                .setColor(Colors.RED)
                .setTitle('Role Removed')
                .setDescription(`<@&${role.id}>`)

            serverLogChannel.send({ embeds: [logEmbed.toJSON()] })
        }
    }

    // Username change
    if (oldMember.user.username !== newMember.user.username) {
        logEmbed
            .setColor(Colors.ORANGE)
            .setTitle('Username change')
            .addFields([
                {
                    name: 'Previous username',
                    value: oldMember.user.username,
                    inline: true
                },
                {
                    name: 'New username',
                    value: newMember.user.username,
                    inline: true
                }
            ])

        serverLogChannel.send({ embeds: [logEmbed.toJSON()] })
    }

    // Nickname change
    if (oldMember.nickname !== newMember.nickname) {
        logEmbed
            .setColor(Colors.ORANGE)
            .setTitle('Nickname change')
            .addFields([
                {
                    name: 'Previous nickname',
                    value: oldMember.user.username,
                    inline: true
                },
                {
                    name: 'New nickname',
                    value: newMember.user.username,
                    inline: true
                }
            ])

        serverLogChannel.send({ embeds: [logEmbed.toJSON()] })
    }

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

