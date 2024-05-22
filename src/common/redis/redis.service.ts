import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { BLACKLISTED_TOKEN_TTL } from './redis.constant';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async reset() {
    return await this.cacheManager.reset();
  }

  async set(key: string, value: string | number, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get(key: string): Promise<string> {
    return this.cacheManager.get(key);
  }

  // token blacklisting
  async blacklistToken(uid: string, token: string): Promise<void> {
    await this.cacheManager.set(uid, token, BLACKLISTED_TOKEN_TTL);
  }

  async validateSafeToken(uid: string, token: string): Promise<boolean> {
    const storedValue = await this.cacheManager.get(uid);
    // console.log(storedValue);
    return storedValue === token ? false : true;
  }

  async clearUserTokens(uid: string): Promise<void> {
    const keys = await this.cacheManager.store.keys(`${uid}:*`);
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }
}
