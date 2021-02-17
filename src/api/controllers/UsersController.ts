import { Request, Response } from 'express';

import * as Yup from 'yup';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

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
  async login (req: Request, res: Response) {
    try {
      await loginSchema.validate(req.body, { abortEarly: false });
  
      const userExists = await User.findOne({ email: req.body.email });
      if (!userExists) return res.status(400).send('Email is incorrect!');
  
      const validPassword = await bcrypt.compare(req.body.password, userExists.password);
      if (!validPassword) return res.status(400).send('Password is incorrect!');
  
      const accessToken = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET!);
      res.header('user-access-token', accessToken).send(accessToken);
    } catch (err) {
      res.status(400).send(err.errors[0]);
    }
  },

  async register (req: Request, res: Response) {
    try {
      await registerSchema.validate(req.body, { abortEarly: false });
  
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) return res.status(400).send('Email already been used!');
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const addUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      await addUser.save();
  
      res.send({ userID: addUser._id });
    } catch (err) {
      res.status(400).send(err.errors[0]);
    }
  },

  async show (req: any, res: Response) {
    const userRequired = await User.findById(req.user._id);
    res.send(userRequired);
  }
};
