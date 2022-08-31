import { Client } from 'redis-om';

/**
 * @param connectionUrl
 * @returns Client
 */
export const getRedisClient = async (connectionUrl: string | null = null): Promise<Client> => {
    let url = process.env.REDIS_URL as string;
    if (connectionUrl) {
        url = connectionUrl;
    }
    return await new Client().open(url);
} 

export const isEntityExist = async (client: Client, entityName: string, entityId: string): Promise<Boolean> => {
    const exists = await client.execute(['EXISTS', `${entityName}:${entityId}`]);
    return exists === 1;
  }