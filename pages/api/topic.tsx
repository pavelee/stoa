// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../services/session';
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchData, topicSchema } from '../../entity/topic';
import { getRedisClient, isEntityExist } from '../../services/redis';

type Data = any

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const entityName = 'Topic';
  let client = await getRedisClient();
  let repo = client.fetchRepository(topicSchema);
  let method = req.method;

  const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    let user = req.session.user;
    let response = {};
    try {
      response = await fetchData(id as string, user);
    } catch (e) {
      if (e.message === 'Not Found') {
        req.session.destroy(); // logout if was logged
        return res.status(404).json({ error: 'Not Found' });
      }
      return res.status(400).json({})
    }
    return res.status(200).json(response)
  }

  const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { content } = req.body;
    let user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    if (!content) {
      return res.status(400).json({ error: 'content parameter required' });
    }
    const postdata = await repo.createAndSave({
      content, author: user.entityId, created: new Date()
    });
    return res.status(200).json(await postdata.getData())
  }

  const handleDelte = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    if (id) {
      const exists = await isEntityExist(client, entityName, id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      repo.remove(id as string);
    }
    return res.status(200).json({});
  }

  const handlePut = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    const { content } = req.body;
    if (id) {
      const exists = await isEntityExist(client, entityName, id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      let data = await repo.fetch(id as string);
      data.modified = new Date();
      if (content) {
        data.content = content;
      }
      repo.save(data);
      return res.status(200).json(await data.getData())
    }
    return res.status(404).json({})
  }

  switch (method) {
    case 'GET':
      return await handleGet(req, res);
    case 'POST':
      return await handlePost(req, res);
    case 'PUT':
      return await handlePut(req, res);
    case 'DELETE':
      return await handleDelte(req, res);
    default:
      res.status(400).json({
        'error': 'Operation not allowed!'
      })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
