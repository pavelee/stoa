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
        // let getdata;
        // getdata = await repo.search().where('username').eq('pciosek').return.all();
        // return res.status(200).json(await getdata[0].getData())

        let user = req.session.user;
        let id = null;
        if (user) {
            id = user.entityId;
        }
        let getdata;
        if (id) {
            const exists = await isEntityExist(client, entityName, id as string);
            if (!exists) {
                req.session.destroy();
                return res.status(404).json({});
            }
            getdata = await repo.fetch(id as string);
            return res.status(200).json(await getdata.getData())
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
