const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

function jwtSingUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentacation.jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

module.exports = {
  async register(req, res) {
    try {
      const user = await User.create(req.body);
      const userJson = user.toJSON();
      return res.send({
        user: userJson,
        token: jwtSingUser(userJson),
      });
    } catch (error) {
      return res.status(400).send({
        error: 'This user credentials is already in use',
      });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(403).send({ error: 'The login information was incorrect' });
      }

      const isPasswordValid = user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(403).send({ error: 'The login information was incorrect' });
      }

      const userJson = user.toJSON();
      delete userJson.password;
      return res.send({
        user: userJson,
        token: jwtSingUser(userJson),
      });
    } catch (error) {
      console.error('error', error);
      return res.status(500).send({
        error: 'An error has occurred trying to log in',
      });
    }
  },
};
