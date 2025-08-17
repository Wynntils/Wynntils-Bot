import { ChatInputCommandInteraction, Client, GuildMemberRoleManager, PermissionResolvable, SlashCommandBuilder, TextChannel } from 'discord.js'
import { client } from '..'
import consola from 'consola'

interface WynntilsCommandOptions {
    helpText?: string;
    roles?: string[];
}

export abstract class WynntilsBaseCommand {
    public readonly helpText: string;
    public readonly roles: string[];
    public readonly requiredPermissions?: PermissionResolvable[];
    protected readonly client: Client;
    public readonly data: SlashCommandBuilder;
    public readonly log: (...args: any[]) => void;

    protected channel: TextChannel | undefined;

    constructor(client: Client, data: SlashCommandBuilder, options: WynntilsCommandOptions = {}) {
        this.client = client;
        this.data = data;
        this.helpText = options.helpText ?? 'No help text available';
        this.roles = options.roles ?? [];
        this.log = consola.log;
    }

    public abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;

    public hasPermission(interaction: ChatInputCommandInteraction): boolean {
        const member = interaction.member;
        const roles = member.roles as GuildMemberRoleManager;

        if (!interaction.guild) return false;
        if (this.roles.length === 0) return true;
        if (interaction.guildId === '541709702136856613' || interaction.guildId === '942560349817831435') return true

        if (member && 'roles' in member) {
            return this.roles.some((roleId) => roles.cache.has(roleId));
        }
        return false;
    }
}
