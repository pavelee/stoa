// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next'
import { userSchema } from '../../entity/user';
import { getRedisClient, isEntityExist } from '../../services/redis';
import { sessionOptions } from '../../services/session';

type Data = any

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    const entityName = 'User';
    let client = await getRedisClient();
    let repo = client.fetchRepository(userSchema);
    let method = req.method;

    const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { best } = req.query;

        let user = req.session.user;
        let id = null;
        if (user) {
            id = user.entityId;
        }
        let getdata: any[] = [];
        if (best) {
            getdata = await repo.search().sortDescending('points').return.all();
            let response = [];
            for (let index = 0; index < getdata.length; index++) {
                const element = getdata[index];
                response.push(await element.getData())
            }
            return res.status(200).json(response)
        }
        if (id) {
            const exists = await isEntityExist(client, entityName, id as string);
            if (!exists) {
                req.session.destroy();
                return res.status(404).json({});
            }
            let user = await repo.fetch(id as string);
            return res.status(200).json(await user.getData())
        }
        res.status(401).json({
            'error': 'Access dnied'
        })
    }

    switch (method) {
        case 'GET':
            return await handleGet(req, res);
        // case 'POST':
        //     return await handlePost(req, res);
        // case 'PUT':
        //     return await handlePut(req, res);
        // case 'DELETE':
        //     return await handleDelte(req, res);
        default:
            res.status(400).json({
                'error': 'Operation not allowed!'
            })
    }
}

export default withIronSessionApiRoute(handler, sessionOptions);
