import consola from 'consola';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { BotChannels } from '../constants/Channel';
import { Staff } from '../constants/Role';
import { staffOnlyEmbed } from '../constants/staffOnlyEmbed';
import { UserInfo } from '../interfaces/api/athena/UserInfo';

export class InfoCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'info',
            description: 'Returns user info',
            options: [
                {
                    name: 'user',
                    description: 'MC username or UUID',
                    type: CommandOptionType.STRING,
                    required: true
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<string | MessageOptions | void> {  
        if (Staff.some(r => ctx.member.roles.includes(r))) {
            let data;
            let response;
            
            try {
                response = await fetch('https://athena.wynntils.com/api/getUser/' + process.env.ATHENA_API_KEY, {
                    method: 'POST',
                    body: JSON.stringify({ user: ctx.options.user.toString() })
                });
                data = await response.json();
            } catch (err) {
                consola.error(err);
                return 'Something went wrong when fetching the user info';
            }

            if (response.ok) {
                const userInfo = data.result as UserInfo;
                const embed = new MessageEmbed();

                embed.setAuthor(userInfo.username, `https://minotar.net/helm/${userInfo.uuid}/100.png`);
                embed.setColor(7531934);
                embed.addFields(
                    {
                        name: 'UUID',
                        value: userInfo.uuid,
                        inline: true
                    },
                    {
                        name: 'Account Type',
                        value: userInfo.accountType,
                        inline: true
                    },
                    {
                        name: 'Latest Version',
                        value: userInfo.versions.lastest,
                        inline: true
                    },
                    {
                        name: 'Last Online',
                        value: (new Date(Math.max(...userInfo.versions.used.values()))).toDateString(),
                        inline: true
                    },
                    {
                        name: 'Cape',
                        value: !userInfo.cosmetics.isElytra,
                        inline: true
                    },
                    {
                        name: 'Ears',
                        value: userInfo.cosmetics.parts.ears,
                        inline: true
                    },
                    {
                        name: 'Elytra',
                        value: userInfo.cosmetics.isElytra,
                        inline: true
                    }
                );
                embed.setFooter(client.user?.username, client.user?.avatarURL() ?? client.user?.defaultAvatarURL);
                return { embeds: [embed] };
            }
            return data.message;
        } else {
            if (BotChannels.every(c => c !== ctx.channelID)) {
                return;
            }
            return { embeds: [staffOnlyEmbed] };
        }
    }
}
