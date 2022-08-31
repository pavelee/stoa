import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getRedisClient } from '../../services/redis';
import { userSchema } from '../../entity/user';
import { build } from '../../entity/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name } = await req.body

    try {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.search().where('name').eq(name).return.first();

        // on prototype purpose, create user with new name
        if (!user) {
            let newuserpayload = await build(
                `user_${Math.floor(Math.random() * 1000 * 1000 * 1000)}`,
                name
            );
            let client = await getRedisClient();
            let repo = client.fetchRepository(userSchema);
            let newuser = await repo.createAndSave(newuserpayload);
            user = newuser;
        }

        req.session.user = user
        await req.session.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export default withIronSessionApiRoute(handler, sessionOptions)