import { Request, Response } from 'express';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, IUser } from '../models/User';
import config from '../config/index';

export interface IRequest extends Request {
  user: {
    _id: string;
  }
}

const registerSchema = Yup.object().shape({
  name: Yup.string().required().min(6).max(255),
  email: Yup.string().required().min(6).email(),
  password: Yup.string().required().min(6).max(1024)
});

const loginSchema = Yup.object().shape({
  email: Yup.string().required().min(6).email(),
  password: Yup.string().required().min(6).max(1024)
});

export default {
  async login(req: Request, res: Response) {
    try {
      const {
        email,
        password
      } = req.body as IUser;

      await loginSchema.validate(req.body, { abortEarly: false });

      const userExists = await User.findOne({ email: email });
      if (!userExists) return res.status(400).send('E-mail is incorrect!');

      const validPassword = await bcrypt.compare(password, userExists.password);
      if (!validPassword) return res.status(400).send('Password is incorrect!');

      const sessionToken = jwt.sign({ _id: userExists._id }, config.tokenSecret!);
      res.header('user-session-token', sessionToken).send(sessionToken);
    } catch (err) {
      res.status(400).send(err.errors[0]);
    }
  },
  async signup(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        password
      } = req.body as IUser;

      await registerSchema.validate(email, { abortEarly: false });

      const emailAlreadyRegistered = await User.findOne({ email: email });
      if (emailAlreadyRegistered) return res.status(400).send('E-mail is already been used!');

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        email: email,
        password: hashPassword
      });
      user.save();

      res.send({ userID: user._id });
    } catch (err) {
      res.status(400).send(err.errors[0]);
    }
  },
  async show(req: IRequest, res: Response) {
    const requiredUser = await User.findById(req.user._id);
    res.send(requiredUser);
  }
}
