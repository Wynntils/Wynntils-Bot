import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { Staff } from "../constants/Role";
import { ConfigService } from "../services/ConfigService";

export class ConfigCommand extends SlashCommand {
    configService: ConfigService = new ConfigService();

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
                    required: false
                    // TODO: provide choices
                }
            ]
        })
        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (Staff.some(r => ctx.member.roles.includes(r))) {
            if (ctx.options.filename) {
                const config = await this.configService.getConfig(ctx.options.user.toString(), ctx.options.filename.toString());
                if (config) {
                    // TODO: Print config
                } else {
                    return `Unable to retrieve ${ctx.options.filename.toString()} for ${ctx.options.user.toString()}`;
                }
            } else {
                const configs = await this.configService.getAllConfigs(ctx.options.user.toString());
                if (configs) {
                    // TODO: Print list of config files
                } else {
                    return `Unable to retrieve list of config files for ${ctx.options.user.toString()}`;
                }
            }
        } else {
            return 'This command is for staff members only';
        }
    }
}
