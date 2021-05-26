import { Router } from 'express';

import { validateSession } from '../subscribers/auth';
import UserService from '../services/UserService';

const routes = Router();
routes.post('/login', UserService.login);
routes.post('/signup', UserService.signup);
routes.get('/posts', validateSession, <any>UserService.show);

export default routes;
