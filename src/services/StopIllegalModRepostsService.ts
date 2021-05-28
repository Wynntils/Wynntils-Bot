import consola from 'consola';
import fetch from 'node-fetch';
import { IllegalModRepostSite } from '../interfaces/api/IllegalModRepostSite';
import { CachedService } from '../interfaces/CachedService';

class StopIllegalModRepostsService extends CachedService<IllegalModRepostSite[]> {
    url = 'https://api.stopmodreposts.org/sites.json';

    cache: IllegalModRepostSite[] = [];
    cachedTime = 0;
    expiresIn: number = 7 * 24 * 60 * 60 * 1000; // 7 days

    async updateCache() {
        try {
            const response = await fetch(this.url);
            this.cache = await response.json();
            this.cachedTime = Date.now();
        } catch (err) {
            consola.error(err);
        }
    }

    async hasIllegalModRepostSite(message: string): Promise<IllegalModRepostSite | undefined> {
        const list = await this.get();
        return list.find((site) => message.match(site.pattern));
    }
}

const stopIllegalModRepostsService = new StopIllegalModRepostsService;

export { stopIllegalModRepostsService };
