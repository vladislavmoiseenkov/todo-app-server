const jwt = require('jsonwebtoken');
const { User, Sessions } = require('../models');
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

      const token = jwtSingUser(userJson);
      await Sessions.create({ token, user_id: userJson.id });

      return res.send({
        user: userJson,
        token,
      });
    } catch (error) {
      console.error('error', error);
      return res.status(500).send({
        error: 'An error has occurred trying to log in',
      });
    }
  },
  async authenticate(req, res) {
    try {
      const { token } = req.body;
      const session = await Sessions.findOne({
        where: {
          token,
        },
      });

      if (!session) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const sessionJSON = session.toJSON();
      const user = await User.findOne({
        where: {
          id: sessionJSON.user_id,
        },
      });
      const userJSON = user.toJSON();
      delete userJSON.password;
      return res.send({
        user: userJSON,
        token: sessionJSON.token,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        error: 'An error has occurred trying to check your status',
      });
    }
  },
  async logout(req, res) {
    try {
      const { token } = req.body;
      const session = await Sessions.findOne({
        where: {
          token,
        },
      });
      if (!session) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }
      await session.destroy();
      return res.send({
        message: 'Logout',
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        message: '',
      });
    }
  },
};
