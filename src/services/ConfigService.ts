import fetch from 'node-fetch'
import { CachedService } from '../interfaces/CachedService'
import { logError } from '../utils/functions'

class ConfigService extends CachedService<string[]> {
    url = 'https://athena.wynntils.com/api/getUserConfig/' + process.env.ATHENA_API_KEY;

    cache: string[] = [];
    cachedTime = 0;
    expiresIn: number = 1 * 24 * 60 * 60 * 1000; // 1 day

    async updateCache(): Promise<void> {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                body: JSON.stringify({
                    user: 'HeyZeer0',
                    configName: 'list'
                })
            })
            const data = await response.json()

            if (response.ok) {
                this.cache = data.result
                this.cachedTime = Date.now()
            } else
                logError(data.message)

        } catch (err) {
            logError(err)
        }
    }
}

const configService = new ConfigService()

export { configService }
