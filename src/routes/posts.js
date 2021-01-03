const router = require('express').Router();

const { validateSession } = require('./validateSession');

const User = require('../models/User');

router.get('/', validateSession, async (req, res) => {
  const userRequired = await User.findById(req.user._id);
  res.send(userRequired);
});

module.exports = router;
