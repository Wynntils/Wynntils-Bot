import { Command, CommandContext, SlashCommandOptions, SlashCreator } from 'slash-create'
import { Client } from 'discord.js'
import { client } from '..'
import consola from 'consola'
import { logError } from '../utils/functions'

interface WynntilsSlashCommandOptions extends SlashCommandOptions {
    helpText?: string;
    roles?: string[];
}

export default class WynntilsBaseCommand extends Command {
    readonly helpText: string
    readonly roles: string[]

    private readonly _client: Client
    public get client(): Client {
        return this._client
    }

    readonly log: (...args: any[]) => void

    constructor(creator: SlashCreator, opts: WynntilsSlashCommandOptions) {
        if (!opts.guildIDs) opts.guildIDs = client.guilds.cache.map(g => g.id)
        super(creator, opts)

        this.helpText = opts.helpText ?? 'No help text available'
        this.roles = opts.roles ?? []

        this._client = client
        this.log = consola.log
    }

    hasPermission(ctx: CommandContext): boolean | string {
        // Check if the user who ran the command has any roles that the command allows
        if (this.roles.length > 0 && ctx.member && ctx.guildID !== undefined) {
            for (const roleID of ctx.member.roles) {
                if (
                    this.roles.includes(roleID)
                    || this.roles.includes(this.client.guilds.cache.get(ctx.guildID)?.roles.cache.get(roleID)?.name ?? 'ROLENOTFOUND')
                ) return true
            }

            if (!this.requiredPermissions)
                return false
        }

        return super.hasPermission(ctx)
    }

}
