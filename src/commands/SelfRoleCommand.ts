import consola from 'consola';
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
        const guild = await client.guilds.fetch(Guild.Wynntils);
        if (guild === undefined) {
            consola.error('Unable to access the Wynntils Discord server.');
            return { content: 'Unable to access the Wynntils Discord server.', ephemeral: true };
        }
        const member = await guild.members.fetch(ctx.member.id);
        if (member === undefined) {
            return { content: 'You are not a member of the Wynntils Discord server.', ephemeral: true };
        }

        const role = ctx.options.role.toString();
        if (!member.roles.cache.has(role)) {
            try {
                await member.roles.add(role);
            } catch {
                console.error('Unable to apply role: ' + role);
                return { content: 'Ran into an error while apply you the role.', ephemeral: true };
            }
            return { content: 'Succesfully given you the role.', ephemeral: true };
        }
        try {
            await member.roles.remove(role);
        } catch {
            console.error('Unable to remove role: ' + role);
            return { content: 'Ran into an error while apply you the role.', ephemeral: true };
        }
        return { content: 'Succesfully removed the role from you.', ephemeral: true };
    }
}
