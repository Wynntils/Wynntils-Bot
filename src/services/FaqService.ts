import { FaqEntry } from '../interfaces/api/FaqEntry';
import { CachedService } from '../interfaces/CachedService';

class FaqService extends CachedService<Map<string, FaqEntry>> {
    cache = new Map;
    cachedTime = 0;
    expiresIn = Infinity; // Never expires

    async updateCache(): Promise<void> {
        // TODO: Convert to api
        const data = require('../../assets/faq.json');
        const newMap = new Map;

        Object.keys(data).forEach((key) => {
            newMap.set(data[key].name, { title: data[key].title, value: data[key].value });
        });

        this.cache = newMap;
    }
}

const faqService = new FaqService();

export { faqService };
