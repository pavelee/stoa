import { Entity, Repository, Schema } from 'redis-om';
import { getRedisClient, isEntityExist } from '../services/redis';
export interface User {
    username: string;
    name: string;
    avatar: string;
    points: number;
    created: Date;
    modified: Date;
}

export class User extends Entity {
    async getData() {
        return {
            id: this.entityId,
            entityId: this.entityId,
            username: this.username,
            name: this.name,
            avatar: this.avatar,
            points: this.points,
            created: JSON.parse(JSON.stringify(this.created)),
            modified: JSON.parse(JSON.stringify(this.modified)),
        }
    }
}

export const userSchema = new Schema(User, {
    username: { type: 'string' },
    name: { type: 'string' },
    avatar: { type: 'string' },
    points: { type: 'number' },
    created: { type: 'date' },
    modified: { type: 'date' },
})

export const getRepo = async (): Promise<Repository<User>> => {
    let client = await getRedisClient();
    let repo = client.fetchRepository(userSchema);
    await repo.createIndex();
    return repo;
}

export const build = async (username: string, name: string) => {
    // @TODO move to service
    const url = 'https://placeimg.com/300/300/animals';
    const fs = require('fs');
    const response = await fetch(url);
    let avatarfile = `avatar_${username}`;
    let saveavatarpath = `/public/avatars/${avatarfile}.jpg`;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.createWriteStream(`.${saveavatarpath}`).write(buffer);

    return {
        username: username,
        name: name,
        avatar: `/avatars/${avatarfile}.jpg`,
        created: new Date(),
        points: 0,
    }
}

export const fetchByIdData = async (id: string, user: User | null = null) => {
    let client = await getRedisClient();
    let repo = client.fetchRepository(userSchema);
    let getdata;
    const exists = await isEntityExist(client, 'User', id as string);
    if (!exists) {
        throw new Error('Not Found');
    }
    getdata = await repo.fetch(id as string);
    return await getdata.getData();
}

export const addPoints = async (userId: any, points: number): Promise<void> => {
    console.log(points);
    let client = await getRedisClient();
    let repo = client.fetchRepository(userSchema);
    let user = await repo.fetch(userId);
    user.points = user.points + points;
    repo.save(user);
}
