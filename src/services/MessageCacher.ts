import consola from 'consola';
import { TextChannel } from 'discord.js';
import { client } from '..';
import { Channel } from '../constants/Channel';
import { Guild } from '../constants/Guild';
import { Message } from '../constants/Message';

class MessageCacher {
    execute(): void {
        this.cacheMessage(Channel.Welcome, Message.WELCOME_REACTION_MESSAGE);
        this.cacheMessage(Channel.Self_Roles, Message.SELF_ROLE_REACTION_MESSAGE);
    }

    cacheMessage(channel: Channel, message: Message): void {
        client.guilds.fetch(Guild.Wynntils).then((guild) => {
            const c = guild.channels.resolve(channel) as TextChannel;
            c.messages.fetch(message);
        }).catch(consola.error);
    }
}

const messageCacher = new MessageCacher();

export { messageCacher };
