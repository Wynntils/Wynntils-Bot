import { GuildMember, MessageReaction, User } from 'discord.js';
import { Channel } from '../constants/Channel';
import { Emoji } from '../constants/Emoji';
import { Role } from '../constants/Role';

export const action = (reaction: MessageReaction, user: User): void => {
    if (user instanceof GuildMember) {
        if (reaction.message.channel.id === Channel.Welcome) {
            user.roles.add(Role.Accepted, 'Reacted in #welcome');
        } else if (reaction.message.channel.id === Channel.Self_Roles) {
            if (reaction.emoji.name === Emoji.ARROWS_COUNTERCLOCKWISE) {
                user.roles.add(Role.ModUpdates, 'Reacted in #self-roles');
            } else if (reaction.emoji.name === Emoji.AYAYA) {
                user.roles.add(Role.Anime, 'Reacted in #self-roles');
            }
        }
    }
};
