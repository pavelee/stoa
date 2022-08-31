import { Entity, Schema } from 'redis-om';
import { getRedisClient } from '../services/redis';
import { likeSchema } from './like';
import { User, userSchema } from './user';

export interface Comment {
    object: string;
    objectid: string;
    content: string;
    author: string;
    created: Date;
    modified: Date;
}

export class Comment extends Entity {
    async getData(user: User | null = null) {
        let author = await this.getAuthor();
        let likes = await this.getLikes();
        let likeData = [];
        // @TODO move to function, to keep DRY
        for (let index = 0; index < likes.length; index++) {
            const element = likes[index];
            likeData.push(await element.getData());
        }
        let isLiked = false;
        if (user) {
            for (let index = 0; index < likeData.length; index++) {
                const element = likeData[index];
                if (element.author.id === user.entityId) {
                    isLiked = true;
                    break;
                }
            }
        }
        return {
            id: this.entityId,
            content: this.content,
            author: await author.getData(),
            likes: likeData,
            isLiked: isLiked,
            created: JSON.parse(JSON.stringify(this.created)),
            modified: JSON.parse(JSON.stringify(this.modified))
        }
    }

    async getAuthor() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.fetch(this.author);
        return user;
    }

    async getLikes() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(likeSchema);
        let likes = await repo.search().where('object').eq('comment').where('objectid').eq(this.entityId).return.all();
        return likes;
    }    
}

export const commentSchema = new Schema(Comment, {
    object: { type: 'string' },
    objectid: { type: 'string' },
    content: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
