import { GuildMember, MessageReaction, User } from 'discord.js';
import { Channel } from '../constants/Channel';
import { Emoji } from '../constants/Emoji';
import { Role } from '../constants/Role';

export const action = (reaction: MessageReaction, user: User): void => {
    if (user instanceof GuildMember) {
        if (reaction.message.channel.id === Channel.Welcome) {
            user.roles.remove(Role.Accepted);
        } else if (reaction.message.channel.id === Channel.Self_Roles) {
            if (reaction.emoji.name === Emoji.ARROWS_COUNTERCLOCKWISE) {
                user.roles.remove(Role.ModUpdates);
            } else if (reaction.emoji.name === Emoji.AYAYA) {
                user.roles.remove(Role.Anime);
            }
        }
    }
};
