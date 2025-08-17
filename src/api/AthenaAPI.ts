import fetch from 'node-fetch'
import { UserInfo } from '../interfaces/api/athena/UserInfo'

type AthenaResponse = { result: UserInfo; message?: string }

export class AthenaAPI {
  constructor(
    private apiKey: string,
    private base = 'https://athena.wynntils.com',
    private userAgent = 'Wynntils Artemis'
  ) {
    if (!apiKey) throw new Error('ATHENA_API_KEY is not set')
  }

  async getUser(user: string): Promise<UserInfo> {
    const res = await fetch(`${this.base}/api/getUser/${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.userAgent,
      },
      body: JSON.stringify({ user }),
    })

    const data = (await res.json()) as Partial<AthenaResponse>

    if (!res.ok) {
      throw new Error(data?.message || `Athena API error (${res.status})`)
    }
    if (!data?.result) {
      throw new Error('Athena API: missing result payload')
    }
    return data.result
  }
}
