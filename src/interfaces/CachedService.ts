export interface CachedService<T> {
    cache: T;
    cachedTime: number;
    expiresIn: number;

    get: () => Promise<T>; 
}
