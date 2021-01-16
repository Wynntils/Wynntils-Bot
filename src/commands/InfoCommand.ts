import { MessageEmbed } from "discord.js";
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { client } from "..";
import { Staff } from "../constants/Role";
import { UserService } from "../services/UserService";

export class InfoCommand extends SlashCommand {
    userInfoSerivce: UserService = new UserService();

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
        })
        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (Staff.some(r => ctx.member.roles.includes(r))) {
            const embed = new MessageEmbed();
            const userInfo = await this.userInfoSerivce.getUser(ctx.options.user.toString());
            if (userInfo) {
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
                        value: userInfo.versions.used,
                        inline: true
                    },
                    {
                        name: 'Cape',
                        value: !userInfo.cosmetics.isElytra,
                        inline: true
                    },
                    {
                        name: 'Ears',
                        value: 'UNKNOWN',
                        inline: true
                    },
                    {
                        name: 'Elytra',
                        value: userInfo.cosmetics.isElytra,
                        inline: true
                    }
                );
                embed.setFooter(client.user?.username, client.user?.avatarURL() ?? '');
                return { embeds: [embed] };
            }
            return `Unable to retrieve info for ${ctx.options.user.toString()}`;
        } else {
            return 'This command is for staff members only';
        }
    }
}
