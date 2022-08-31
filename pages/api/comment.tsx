// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next'
import { commentSchema } from '../../entity/comment';
import { topicSchema } from '../../entity/topic';
import { getRedisClient, isEntityExist } from '../../services/redis';
import { sessionOptions } from '../../services/session';

type Data = any

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const entityName = 'Comment';
  let client = await getRedisClient();
  let repo = client.fetchRepository(commentSchema);
  let method = req.method;

  const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    let s = repo.search();
    let getdata;
    if (id) {
      const exists = await isEntityExist(client, entityName, id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      getdata = [await repo.fetch(id as string)];
    } else {
      getdata = await s.return.all();
    }
    let response = [];
    for (let index = 0; index < getdata.length; index++) {
      const element = getdata[index];
      response.push(await element.getData())
    }
    return res.status(200).json(getdata)
  }

  const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { content, object, objectid } = req.body;
    let user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    if (!content) {
      return res.status(400).json({
        'error': 'content parametr required'
      })
    }
    if (!object) {
      return res.status(400).json({
        'error': 'object parametr required'
      })
    }
    if (!objectid) {
      return res.status(400).json({
        'error': 'object parametr required'
      })
    }
    // cut request if object dosent exists
    switch (object) {
      case 'topic':
        let topicRepo = client.fetchRepository(topicSchema);
        let topic = topicRepo.fetch(objectid);
        if (!topic) {
          return res.status(400).json({
            error: 'topic dosent exists'
          });
        }
        break;
      default:
        return res.status(400).json({
          error: 'object not supported'
        })
    }
    const postdata = await repo.createAndSave({
      content, object, objectid, author: user.entityId, created: new Date()
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