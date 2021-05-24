import consola from 'consola';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { Staff } from '../constants/Role';
import { configService } from '../services/ConfigService';

export class ConfigCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'config',
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

    hasPermission(ctx: CommandContext): boolean | string {
        const { member } = ctx;
        if (!member) {
            return 'This command doesn\'t work in DMs';
        }
        return Staff.some(r => member.roles.includes(r));
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = new MessageEmbed();
        embed.setFooter(client.user?.username, client.user?.avatarURL() ?? client.user?.defaultAvatarURL);

        if (ctx.options.filename) {
            const configFiles = await configService.get();
            if (!configFiles.includes(ctx.options.filename.toString())) {
                embed.setColor(0xff5349)
                    .setTitle(':x: Invalid Config Name - Available Configs')
                    .setDescription(`\`${configFiles.join('`\n`')}\``);
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
                embed.setColor(0xff5349)
                    .setTitle(':x: Oops! Error D;')
                    .setDescription('Something went wrong when fetching the user\'s config.');

                return { embeds: [embed], ephemeral: true };
            }

            if (response.ok) {
                const configString = JSON.stringify(data.result, null, 2);
                const part = ctx.options.part ? Number.parseInt(ctx.options.part.toString()) : 1;
                const totalParts = Math.ceil(configString.length / 1800);

                if (part > totalParts) {
                    embed.setColor(0xff5349)
                        .setTitle(':octagonal_sign: End of Config')
                        .setDescription(`This config file does not have more than ${totalParts} parts.`);

                    return { embeds: [embed], ephemeral: true };
                }

                embed.setColor(0x72ed9e)
                    .setTitle(`${ctx.options.user.toString()} - ${ctx.options.filename} - (${part}/${totalParts})`)
                    .setDescription(`\`\`\`json\n${configString.substr((part - 1) * 1800, 1800)}\n\`\`\``);

                return { embeds: [embed] };
            }

            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription( data.message);

            return { embeds: [embed], ephemeral: true };
        }

        const configFiles = await configService.get();
        embed.setColor(0x72ed9e)
            .setTitle('Available Configs')
            .setDescription(`\`${configFiles.join('`\n`')}\``);

        return { embeds: [embed] };
    }
}
