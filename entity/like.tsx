import { Entity, Schema } from 'redis-om';
import { getRedisClient } from '../services/redis';
import { userSchema } from './user';

export interface Like {
    object: string;
    objectid: string;
    author: string;
    created: Date;
    modified: Date;
}

export class Like extends Entity {
    async getData() {
        let author = await this.getAuthor();
        return {
            id: this.entityId,
            author: await author.getData(),
            created: JSON.parse(JSON.stringify(this.created)),
            modified: JSON.parse(JSON.stringify(this.modified)),
        }
    }

    async getAuthor() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.fetch(this.author);
        return user;
    }
}

export const likeSchema = new Schema(Like, {
    object: { type: 'string' },
    objectid: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
