import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../services/session';
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    req.session.destroy()
    res.json({})
}

export default withIronSessionApiRoute(handler, sessionOptions)