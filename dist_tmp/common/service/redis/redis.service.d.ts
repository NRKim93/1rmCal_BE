import { OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleDestroy {
    private client;
    constructor();
    onModuleDestroy(): Promise<void>;
    hset(key: string, field: string, value: string): Promise<number>;
    hget(key: string, value: string): Promise<string | null>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
}
