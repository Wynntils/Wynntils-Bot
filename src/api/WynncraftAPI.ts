import fetch from 'node-fetch'

export type WynnGuild = {
  name?: string
  prefix?: string
  rank?: string
  rankStars?: string
}
export type WynnPlayerMain = { guild?: WynnGuild | null }

export class WynncraftAPI {
  constructor(
    private base = 'https://api.wynncraft.com/v3',
    private userAgent = 'Wynntils'
  ) {}

  /** Returns "RANK of GUILDNAME" or "No guild" */
  async getGuildLine(uuidOrName: string): Promise<string> {
    const id = encodeURIComponent(uuidOrName)
    const res = await fetch(`${this.base}/player/${id}`, {
      headers: { 'User-Agent': this.userAgent },
    })
    if (!res.ok) return 'No guild'

    const data = (await res.json()) as WynnPlayerMain
    const g = data?.guild ?? null
    if (g?.name && g?.rank) return `${g.rank.toUpperCase()} of ${g.name} [${g.prefix}]`
    return 'No guild'
  }
}
