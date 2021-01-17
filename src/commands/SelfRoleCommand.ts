import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { client } from '..';
import { Guild } from '../constants/Guild';
import { Role } from '../constants/Role';

export class SelfRoleCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'selfrole',
            description: 'Either adds or removes a given role',
            options: [
                {
                    name: 'role',
                    description: 'Role to be toggled',
                    type: CommandOptionType.STRING,
                    required: true,
                    choices: [
                        {
                            name: 'Accepted',
                            value: Role.Accepted
                        },
                        {
                            name: 'Mod Updated',
                            value: Role.ModUpdates
                        },
                        {
                            name: 'Anime',
                            value: Role.Anime
                        },
                    ]
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<void> {
        const member = client.guilds.cache.get(Guild.Wynntils)?.members.cache.get(ctx.member.id);
        if (member === undefined) {
            return;
        }

        const role = ctx.options.role.toString();
        if (member.roles.cache.has(role)) {
            member.roles.add(role);
        } else {
            member.roles.remove(role);
        }
    }
}
