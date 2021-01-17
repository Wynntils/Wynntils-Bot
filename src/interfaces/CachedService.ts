export abstract class CachedService<T> {
    abstract cache: T;
    abstract cachedTime: number;
    abstract expiresIn: number;

    init(): Promise<void> {
        return this.updateCache();
    }

    abstract updateCache(): Promise<void>; 

    async get(): Promise<T> {
        if (Date.now() - this.cachedTime > this.expiresIn) {
            await this.updateCache();
        }
        return this.cache;
    }
}
