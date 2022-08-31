// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next'
import { likeSchema } from '../../entity/like';
import { getRedisClient, isEntityExist } from '../../services/redis';
import { sessionOptions } from '../../services/session';

type Data = any

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const entityName = 'Like';
  let client = await getRedisClient();
  let repo = client.fetchRepository(likeSchema);
  let method = req.method;

  const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { object, objectid } = req.query;
    let user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    let s = repo.search();
    let getdata = [];
    if (object && objectid && user) {
      let like = await repo.search().where('object').eq(object as string).where('objectid').eq(objectid as string).where('author').eq(user.entityId).return.first();
      if (like) {
        getdata = [like];
      } else {
        res.status(404).json({ error: 'not found' });
      }
    }

    let response = [];
    for (let index = 0; index < getdata.length; index++) {
      const element = getdata[index];
      response.push(await element.getData())
    }
    return res.status(200).json(getdata)
  }

  const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { object, objectid } = req.body;
    if (!object) {
      return res.status(400).json({
        'error': 'object parametr required'
      })
    } else {
      if (['topic', 'comment'].indexOf(object) === -1) {
        return res.status(400).json({
          'error': "Available objects topic, comment"
        })
      }
    }
    if (!objectid) {
      return res.status(400).json({
        'error': 'objectid parametr required'
      })
    } else {
      if (object === 'topic') {
        let exists = await isEntityExist(client, 'Topic', objectid);
        if (!exists) {
          return res.status(400).json({
            'error': 'topic dosent exists'
          })
        }
      }
      if (object === 'comment') {
        let exists = await isEntityExist(client, 'Comment', objectid);
        if (!exists) {
          return res.status(400).json({
            'error': 'comment dosent exists'
          })
        }
      }
    }
    let user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    let like = await repo.search().where('object').eq(object as string).where('objectid').eq(objectid as string).where('author').eq(user.entityId).return.first();
    if (like) {
      return res.status(400).json({ error: 'Like already exists' });
    }
    const likedata = await repo.createAndSave({
      object, objectid, author: user.entityId, created: new Date()
    });
    return res.status(200).json(await likedata.getData())
  }

  const handleDelte = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { object, objectid } = req.body;
    let user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    if (object && objectid && user) {
      let like = await repo.search().where('object').eq(object as string).where('objectid').eq(objectid as string).where('author').eq(user.entityId).return.first();
      if (!like) {
        return res.status(404).json({});
      }
      if (user.entityId !== like.author) {
        return res.status(400).json({ error: 'It have to owner of like to remove it' })
      }
      repo.remove(like.entityId);
    }
    return res.status(200).json({});
  }

  switch (method) {
    case 'GET':
      return await handleGet(req, res);
    case 'POST':
      return await handlePost(req, res);
    // case 'PUT':
    //   return await handlePut(req, res);
    case 'DELETE':
      return await handleDelte(req, res);
    default:
      res.status(400).json({
        'error': 'Operation not allowed!'
      })
  }
}


export default withIronSessionApiRoute(handler, sessionOptions);