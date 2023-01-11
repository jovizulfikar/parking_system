import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import LogService from '../services/LogService';

export interface ExtendedRequest {
  logService: LogService
}

function initiliazeInstances(req: any, res: NextApiResponse, next: NextHandler) {
  req.logService = new LogService();
  next();
}

const middleware = nextConnect<NextApiRequest, NextApiResponse>()
  .use(initiliazeInstances);

export default middleware;