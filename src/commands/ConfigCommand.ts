import consola from 'consola';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { Guild } from '../constants/Guild';
import { Staff } from '../constants/Role';
import { configService } from '../services/ConfigService';

export class ConfigCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'config',
            guildID: Guild.Wynntils,
            description: 'Retrieves configs for a given user',
            options: [
                {
                    name: 'user',
                    description: 'MC username or UUID',
                    type: CommandOptionType.STRING,
                    required: true
                },
                {
                    name: 'filename',
                    description: 'Config filename',
                    type: CommandOptionType.STRING,
                    required: false,
                },
                {
                    name: 'part',
                    description: 'Part of config per 1800 characters',
                    type: CommandOptionType.INTEGER,
                    required: false
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        if (Staff.some(r => ctx.member.roles.includes(r))) {
            if (ctx.options.filename) {
                const configFiles = await configService.get();
                if (!configFiles.includes(ctx.options.filename.toString())) {
                    const embed = new MessageEmbed();
                    embed.setColor(7531934);
                    embed.setTitle('Invalid Config Name - Available Configs:');
                    embed.setDescription(`\`${configFiles.join('`\n`')}\``);
                    embed.setFooter(client.user?.username, client.user?.avatarURL() ?? client.user?.defaultAvatarURL);
                    return { embeds: [embed] };
                }

                let response;
                let data;

                try {
                    response = await fetch('https://athena.wynntils.com/api/getUserConfig/' + process.env.ATHENA_API_KEY, {
                        method: 'POST',
                        body: JSON.stringify({
                            user: ctx.options.user,
                            configName: ctx.options.filename
                        })
                    });
                    data = await response.json();
                } catch (err) {
                    consola.error(err);
                    return { content: 'Something went wrong when fetching the user\'s config', ephemeral: true };
                }

                if (response.ok) {
                    const embed = new MessageEmbed();
                    const configString = JSON.stringify(data.result, null, 2);
                    const part = ctx.options.part ? Number.parseInt(ctx.options.part.toString()) : 1;
                    const totalParts = Math.ceil(configString.length / 1800);

                    if (part > totalParts) {
                        return { content: `This config file does not have more than ${totalParts} parts.`, ephemeral: true };
                    }

                    embed.setColor(7531934);
                    embed.setTitle(`${ctx.options.user.toString()} - ${ctx.options.filename} - (${part}/${totalParts})`);
                    embed.setDescription(`\`\`\`json\n${configString.substr((part - 1) * 1800, 1800)}\n\`\`\``);

                    embed.setFooter(client.user?.username, client.user?.avatarURL() ?? client.user?.defaultAvatarURL);

                    return { embeds: [embed] };
                } else {
                    return data.message;
                }
            } else {
                const configFiles = await configService.get();
                const embed = new MessageEmbed()
                    .setColor(7531934)
                    .setTitle('Available Configs:')
                    .setDescription(`\`${configFiles.join('`\n`')}\``)
                    .setFooter(client.user?.username, client.user?.avatarURL() ?? client.user?.defaultAvatarURL);
                return { embeds: [embed] };
            }
        } else {
            return { content: 'This command is for staff members only!', ephemeral: true };
        }
    }
}
