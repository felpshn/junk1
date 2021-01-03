const router = require('express').Router();
const Yup = require('yup');

const User = require('../models/User');

const schema = Yup.object().shape({
  name: Yup.string().required().min(6),
  email: Yup.string().required().min(6).email(),
  password: Yup.string().required().min(6).max(1024)
});

router.post('/register', async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    const savedUser = await user.save();
    res.send(savedUser);

    console.log('User was registered.');
  } catch (e) {
    res.status(400).send(e.errors);
  }
});

module.exports = router;
