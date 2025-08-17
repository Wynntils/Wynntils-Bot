import { Guild } from '../interfaces/api/athena/Guild'
import { CachedService } from '../interfaces/CachedService'

const GUILD_COLORS_URL = 'https://athena.wynntils.com/cache/get/guildListWithColors'

export class GuildColorService extends CachedService<Guild[]> {
  cache: Guild[] = []
  cachedTime = 0
  expiresIn = 10 * 60 * 1000

  private static _instance: GuildColorService | null = null
  static instance(): GuildColorService {
    return this._instance ?? (this._instance = new GuildColorService())
  }

  async updateCache(): Promise<void> {
    const res = await fetch(GUILD_COLORS_URL, { headers: { accept: 'application/json' } })
    if (!res.ok) throw new Error(`Failed fetching guild colors: ${res.status}`)
    const json = await res.json()
    this.cache = Object.values(json);
    this.cachedTime = Date.now()
  }
}


const guildColorService = new GuildColorService()

export { guildColorService }
