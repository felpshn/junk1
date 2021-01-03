const router = require('express').Router();

const Yup = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const registerSchema = Yup.object().shape({
  name: Yup.string().required().min(6).max(255),
  email: Yup.string().required().min(6).email(),
  password: Yup.string().required().min(6).max(1024)
});

const loginSchema = Yup.object().shape({
  email: Yup.string().required().min(6).email(),
  password: Yup.string().required().min(6).max(1024)
});

router.post('/register', async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('This email address is already taken.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await newUser.save();
    res.send({ userID: newUser._id });

  } catch (e) {
    res.status(400).send(e.errors[0]);
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) return res.status(400).send('Email is incorrect.');

    const validPassword = await bcrypt.compare(req.body.password, userExists.password);
    if (!validPassword) return res.status(400).send('Password is incorrect.');

    const accessToken = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET);
    res.header('user-access-token', accessToken).send(accessToken);

  } catch (e) {
    res.status(400).send(e.errors[0]);
  }
});

module.exports = router;
