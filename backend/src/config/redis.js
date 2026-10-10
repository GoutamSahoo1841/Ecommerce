import net from 'net';
import { createClient } from 'redis';

let redisClient = null;
let isRedisConnected = false;
let useMemoryCache = false;

// In-Memory Redis Engine
const patternToRegex = (pattern) => {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`);
};

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
    return true;
  }

  keys(pattern) {
    const regex = patternToRegex(pattern);
    const now = Date.now();
    const matched = [];
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.store.delete(key);
        continue;
      }
      if (regex.test(key)) {
        matched.push(key);
      }
    }
    return matched;
  }

  del(keys) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    let count = 0;
    for (const key of keyList) {
      if (this.store.delete(key)) count++;
    }
    return count;
  }

  clear() {
    this.store.clear();
  }
}

const memoryCache = new MemoryCache();

const checkPortOpen = (host, port, timeout = 300) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(true);
      }
    });

    socket.on('timeout', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on('error', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.connect(port, host);
  });
};

const startMemoryCache = () => {
  useMemoryCache = true;
  isRedisConnected = true;
  console.log('[Redis] In-Memory Redis Cache started and ready!');
};

const initRedis = async () => {
  if (process.env.USE_REDIS === 'false') {
    console.log('[Redis] Disabled via USE_REDIS=false');
    return;
  }

  const explicitRedisUrl = process.env.REDIS_URL;

  if (explicitRedisUrl) {
    console.log(`[Redis] Connecting to external Redis at ${explicitRedisUrl}...`);
    try {
      redisClient = createClient({ url: explicitRedisUrl });
      redisClient.on('error', (err) => {
        console.warn(`[Redis] External connection issue: ${err.message || err}. Falling back to In-Memory Cache.`);
        startMemoryCache();
      });
      await redisClient.connect();
      isRedisConnected = true;
      useMemoryCache = false;
      console.log('[Redis] Connected successfully to external Redis and ready!');
      return;
    } catch (err) {
      console.warn(`[Redis] External connection failed: ${err.message || err}. Falling back to In-Memory Cache.`);
      startMemoryCache();
      return;
    }
  }

  // Check if a local Redis server is actually running on port 6379
  const isLocalRedisAvailable = await checkPortOpen('127.0.0.1', 6379, 300);

  if (isLocalRedisAvailable) {
    console.log('[Redis] Local Redis detected on port 6379. Connecting...');
    try {
      redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
      redisClient.on('error', (err) => {
        console.warn(`[Redis] Local connection error: ${err.message || err}. Falling back to In-Memory Cache.`);
        startMemoryCache();
      });
      await redisClient.connect();
      isRedisConnected = true;
      useMemoryCache = false;
      console.log('[Redis] Connected successfully to local Redis!');
      return;
    } catch (err) {
      console.warn(`[Redis] Connection failed: ${err.message || err}. Falling back to In-Memory Cache.`);
      startMemoryCache();
      return;
    }
  }

  // If no local or external Redis is running, start the in-memory cache directly
  startMemoryCache();
};

export const getCache = async (key) => {
  if (!isRedisConnected) {
    return null;
  }
  try {
    let cachedData = null;
    if (useMemoryCache) {
      cachedData = memoryCache.get(key);
    } else if (redisClient && redisClient.isOpen) {
      cachedData = await redisClient.get(key);
    }

    if (cachedData) {
      console.log(`[Redis Cache] HIT for key: ${key}`);
      return typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    }
    console.log(`[Redis Cache] MISS for key: ${key}`);
  } catch (err) {
    console.error(`[Redis Cache] Error reading key ${key}:`, err.message || err);
  }
  return null;
};

export const setCache = async (key, value, ttl = 300) => {
  if (!isRedisConnected) {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    if (useMemoryCache) {
      memoryCache.set(key, serialized, ttl);
    } else if (redisClient && redisClient.isOpen) {
      await redisClient.set(key, serialized, { EX: ttl });
    }
    console.log(`[Redis Cache] SET key: ${key} with TTL: ${ttl}s`);
    return true;
  } catch (err) {
    console.error(`[Redis Cache] Error writing key ${key}:`, err.message || err);
  }
  return false;
};

export const clearCachePattern = async (pattern) => {
  if (!isRedisConnected) {
    return false;
  }
  try {
    let keys = [];
    if (useMemoryCache) {
      keys = memoryCache.keys(pattern);
      if (keys.length > 0) {
        memoryCache.del(keys);
      }
    } else if (redisClient && redisClient.isOpen) {
      keys = await redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    if (keys && keys.length > 0) {
      console.log(`[Redis Cache] CLEAR keys matching pattern: ${pattern} (Cleared ${keys.length} keys)`);
    } else {
      console.log(`[Redis Cache] CLEAR pattern: ${pattern} - no matching keys found`);
    }
    return true;
  } catch (err) {
    console.error(`[Redis Cache] Error clearing pattern ${pattern}:`, err.message || err);
  }
  return false;
};

export { redisClient, isRedisConnected, initRedis };
