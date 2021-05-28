import consola from 'consola';
import { MessageReaction, User } from 'discord.js';
import { client } from '..';
import { Channel } from '../constants/Channel';
import { Emoji, watchedEmotes } from '../constants/Emoji';
import { Guild } from '../constants/Guild';
import { Role } from '../constants/Role';

export const action = async (reaction: MessageReaction, user: User): Promise<void> => {
    if (reaction.partial) {
        await reaction.fetch().catch(consola.error);
    }
    if (!watchedEmotes.includes(reaction.emoji.identifier)) {
        // Prevent unneccesary fetching of data.
        return;
    }
    if (reaction.message.partial) {
        await reaction.message.fetch().catch(consola.error);
    }
    if (user.id === undefined) {
        await user.fetch().catch(consola.error);
    }

    let guildMember;
    try {
        const guild = await client.guilds.fetch(Guild.Wynntils);
        guildMember = await guild.members.fetch(user.id);
    } catch (err) {
        consola.error(err);
    }

    if (guildMember) {
        if (reaction.message.channel.id === Channel.Welcome) {
            guildMember.roles.remove(Role.Accepted, 'Reacted in #welcome').catch(consola.error);
        } else if (reaction.message.channel.id === Channel.Self_Roles) {
            if (reaction.emoji.identifier === Emoji.ARROWS_COUNTERCLOCKWISE) {
                guildMember.roles.remove(Role.ModUpdates, 'Reacted in #self-roles').catch(consola.error);
            } else if (reaction.emoji.identifier === Emoji.AYAYA) {
                guildMember.roles.remove(Role.Anime, 'Reacted in #self-roles').catch(consola.error);
            }
        }
    } else {
        consola.error(`Unable to find user (${user.id}) in Wynntils Discord server.`);
    }
};
