import {Injectable, OnModuleDestroy} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy{
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        });
    }

    //  앱 종료 시 Redis 커넥션 정리
    async onModuleDestroy() {
        await this.client.quit();
    }

    async hset(key: string, field:string ,value: string) {
        return await this.client.hset(key, field, value);
    };

    async hget(key: string,value:string) {
        return await this.client.hget(key,value);
    }

    async del(key: string) {
        return await this.client.del(key);
    }

    async exists(key: string) {
        return await this.client.exists(key);
    }
}
