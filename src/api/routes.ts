import { Router } from 'express';

import UsersController from './controllers/UsersController';

import { validateSession } from './middlewares/auth';

const routes = Router();
routes.post('/login', UsersController.login);
routes.post('/register', UsersController.register);
routes.get('/posts', <any>validateSession, UsersController.show);

export default routes;
