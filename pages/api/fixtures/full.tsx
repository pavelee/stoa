// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, Repository } from 'redis-om';
import { topicSchema } from '../../../entity/topic';
import { userSchema, build } from '../../../entity/user';
import { commentSchema } from '../../../entity/comment';
import { likeSchema } from '../../../entity/like';
import { viewSchema } from '../../../entity/view';

type Data = any;

const resetAll = async (repo: any) => {
    await repo.createIndex();
    const entites = await repo.search().return.all();
    for (let index = 0; index < entites.length; index++) {
        const entity = entites[index];
        repo.remove(entity.entityId)
    }
}

const createEntity = async (repo: any, data: object) => {
    const entity = await repo.createAndSave(data)
    return entity
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let client = await new Client().open(process.env.REDIS_URL);

    const userRepo = client.fetchRepository(userSchema);
    await resetAll(userRepo);

    const pciosek = await createEntity(userRepo, await build(
        'pciosek',
        'Paweł Ciosek'
    ));

    const topicRepo = client.fetchRepository(topicSchema);
    await resetAll(topicRepo);
    const topic = await createEntity(topicRepo, {
        content: 'We are serious!',
        author: pciosek.entityId,
        created: new Date(),
    });

    const likeRepo = client.fetchRepository(likeSchema);
    await resetAll(likeRepo);
    const like = await createEntity(likeRepo, {
        author: pciosek.entityId,
        object: 'topic',
        objectid: topic.entityId,
        created: new Date(),
    });

    const viewRepo = client.fetchRepository(viewSchema);
    await resetAll(viewRepo);
    const view = await createEntity(viewRepo, {
        author: pciosek.entityId,
        object: 'topic',
        objectid: topic.entityId,
        created: new Date(),
    });

    const commentRepo = client.fetchRepository(commentSchema);
    await resetAll(commentRepo);
    await createEntity(commentRepo, {
        content: 'ala ma kota!',
        object: 'topic',
        objectid: topic.entityId,
        author: pciosek.entityId,
        created: new Date(),
    });
    await createEntity(commentRepo, {
        content: 'moj komentarz!',
        object: 'topic',
        objectid: topic.entityId,
        author: pciosek.entityId,
        created: new Date(),
    });

    res.status(200).json({})
}
