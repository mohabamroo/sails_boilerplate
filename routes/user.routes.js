module.exports = {
  'POST /auth/register': 'AuthController.register',
  'POST /auth/login': 'AuthController.login',
  'DELETE /auth/:id': {
    controller: 'AuthController',
    action: 'destroy'
  },
  'GET /auth/': 'AuthController.find',
  'PATCH /auth/:id': 'AuthController.update'
};
