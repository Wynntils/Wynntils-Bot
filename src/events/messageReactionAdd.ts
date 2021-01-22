import consola from 'consola';
import { GuildMember, MessageReaction, User } from 'discord.js';
import { Channel } from '../constants/Channel';
import { Emoji } from '../constants/Emoji';
import { Role } from '../constants/Role';

export const action = async (reaction: MessageReaction, user: User): Promise<void> => {
    if (reaction.message.partial) {
        await reaction.message.fetch().catch(consola.error);
    }
    if (reaction.partial) {
        await reaction.fetch().catch(consola.error);
    }

    if (user instanceof GuildMember) {
        if (reaction.message.channel.id === Channel.Welcome) {
            user.roles.add(Role.Accepted, 'Reacted in #welcome').catch(consola.error);
        } else if (reaction.message.channel.id === Channel.Self_Roles) {
            if (reaction.emoji.identifier === Emoji.ARROWS_COUNTERCLOCKWISE) {
                user.roles.add(Role.ModUpdates, 'Reacted in #self-roles').catch(consola.error);
            } else if (reaction.emoji.identifier === Emoji.AYAYA) {
                user.roles.add(Role.Anime, 'Reacted in #self-roles').catch(consola.error);
            }
        }
    }
};
