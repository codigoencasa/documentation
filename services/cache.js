
import { createCache, memoryStore } from 'cache-manager';


export const cache = createCache(memoryStore(), {
    max: 100,
    ttl: 3600 * 1000 /*milliseconds*/,
});