import { MessageEmbed } from "discord.js";
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { Staff } from "../constants/Role";
import { UserInfoService } from "../services/UserInfoService";

export class InfoCommand extends SlashCommand {
    userInfoSerivce: UserInfoService = new UserInfoService();

    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'info',
            description: 'Returns user info',
            options: [
                {
                    name: 'user',
                    description: 'MC username or UUID',
                    type: CommandOptionType.STRING,
                    required: true,
                    options: [
                        {
                            name: 'config',
                            description: 'Whether all config files will be listed',
                            type: CommandOptionType.BOOLEAN,
                            required: false,
                            options: [
                                {
                                    name: 'filename',
                                    description: 'Config filename',
                                    type: CommandOptionType.STRING,
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (Staff.some(r => ctx.member.roles.includes(r))) {
            const embed = new MessageEmbed();
            console.log(ctx.options);
            return { embeds: [embed] };
        } else {
            return 'This command is reserved for staff members only';
        }
    }
}
