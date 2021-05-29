import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';

function validateSession(req: any, res: Response, next: NextFunction) {
  const sessionToken = req.header('user-session-token');
  if (!sessionToken) return res.status(401).send('Access denied.');

  try {
    const verifiedToken = jwt.verify(sessionToken, config.tokenSecret!);
    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
}

export { validateSession };
