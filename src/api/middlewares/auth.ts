import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

export interface IRequest extends Request {
  user: object | string;
}

function validateSession (req: IRequest, res: Response, next: NextFunction) {
  const accessToken = req.header('user-access-token');
  if (!accessToken) return res.status(401).send('Access denied.');

  try {
    const verifiedToken = jwt.verify(accessToken, process.env.TOKEN_SECRET!);
    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

export { validateSession };
