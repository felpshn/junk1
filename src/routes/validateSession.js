const jwt = require('jsonwebtoken');

function validateSession (req, res, next) {
  const accessToken = req.header('user-access-token');
  if (!accessToken) return res.status(401).send('Access denied.');

  try {
    const verifiedToken = jwt.verify(accessToken, process.env.TOKEN_SECRET);
    req.user = verifiedToken;
    next();
  } catch (e) {
    res.status(400).send('Invalid token.');
  }
}

module.exports = {
  validateSession
};
