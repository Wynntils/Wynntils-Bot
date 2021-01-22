import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { Guild } from '../constants/Guild';
import { Role } from '../constants/Role';

export class SelfRoleCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'selfrole',
            guildID: Guild.Wynntils,
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

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const member = await client.guilds.cache.get(Guild.Wynntils)?.members.fetch(ctx.member.id);
        if (member === undefined) {
            return { content: 'You are not a member of the Wynntils Discord server.', ephemeral: true };
        }

        const role = ctx.options.role.toString();
        if (member.roles.cache.has(role)) {
            await member.roles.add(role);
            return { content: 'Succesfully given you the role.', ephemeral: true };
        }

        await member.roles.remove(role);
        return { content: 'Succesfully removed the role from you.', ephemeral: true };
    }
}
