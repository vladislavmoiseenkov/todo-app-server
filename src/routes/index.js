// Controllers
const AuthController = require('../controllers/AuthController');

// Policy (middleware)
const AuthControllerPolicy = require('../policy/AuthControllerPolicy');

module.exports = (app) => {
  app.post('/register', [AuthControllerPolicy.register], AuthController.register);
};
