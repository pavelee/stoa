import { Repository, Schema } from "redis-om";
import { getRedisClient } from "./redis";
import { topicSchema } from "../entity/topic";
import { commentSchema } from "../entity/comment";
import { userSchema } from "../entity/user";

export const createRepository = async (schemaName: string) => {
    let client = await getRedisClient();
    switch (schemaName) {
        case 'topic':
            return client.fetchRepository(topicSchema);
        case 'comment':
            return client.fetchRepository(commentSchema);
        case 'user':
            return client.fetchRepository(userSchema);
    }
    throw new Error(`schema ${schemaName} not found`);
}