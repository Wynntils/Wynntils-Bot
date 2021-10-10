import consola from 'consola';
import fetch from 'node-fetch';
import { IllegalModRepostSite } from '../interfaces/api/IllegalModRepostSite';
import { CachedService } from '../interfaces/CachedService';

class StopIllegalModRepostsService extends CachedService<IllegalModRepostSite[]> {
    url = 'https://api.stopmodreposts.org/sites.json';

    cache: IllegalModRepostSite[] = [];
    cachedTime = 0;
    expiresIn: number = 604800000; // 7 days

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
        return list.find((site) => message.match("https?://([^\\s\\.]+\\.)*" + site.domain.replace(".", "\\.") + "(/[^\\s]*)?"));
    }
}

const stopIllegalModRepostsService = new StopIllegalModRepostsService;

export { stopIllegalModRepostsService };
