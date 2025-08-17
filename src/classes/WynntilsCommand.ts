import { ChatInputCommandInteraction, Client, PermissionResolvable, SlashCommandBuilder, TextChannel } from 'discord.js'
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
        if (!interaction.guild) return true;
        if (this.roles.length === 0) return true;
        const member = interaction.member;
        if (member && 'roles' in member) {
            const memberRoles = Array.from(member.roles instanceof Array ? member.roles : member.roles.cache.keys());
            return this.roles.some(role => memberRoles.includes(role));
        }
        return false;
    }
}
