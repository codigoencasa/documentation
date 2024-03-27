
import { createCache, memoryStore } from 'cache-manager';

export const ttl = 24 * 60 * 60 * 1000
export const cache = createCache(memoryStore(), {
    max: 100,
    ttl /*milliseconds*/,
    ttlAutopurge: true
});