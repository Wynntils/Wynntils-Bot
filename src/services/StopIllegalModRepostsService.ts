import fetch from 'node-fetch';
import consola from 'consola';
import { IllegalModRepostSite } from "../interfaces/api/IllegalModRepostSite";
import { CachedService } from "../interfaces/CachedService";

export class StopIllegalModRepostsService implements CachedService<IllegalModRepostSite[]> {
    url: string = 'https://api.stopmodreposts.org/sites.json';
    expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
    cache: IllegalModRepostSite[] = [];
    cachedTime: number = 0;

    constructor() {
        this.cachedTime = Date.now();
        fetch(this.url).then((res) => res.json()).then((data: IllegalModRepostSite[]) => {
            this.cache = data;
        }).catch(consola.error);
    }


    async get(): Promise<IllegalModRepostSite[]> {
        if (this.cachedTime && Date.now() - this.cachedTime > this.expiresIn) {
            this.cachedTime = Date.now();
            const response = await fetch(this.url);
            const data = (await response.json()) as IllegalModRepostSite[];
            this.cache = data;
        }
        return this.cache;
    }

    async hasIllegalModRepostSite(message: string): Promise<IllegalModRepostSite | undefined> {
        const list = await this.get();
        return list.find((site) => message.match(site.pattern));
    }
}
