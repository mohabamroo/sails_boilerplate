module.exports = {
  'POST /auth/register': 'AuthController.register',
  'POST /auth/login': 'AuthController.login',
  'POST /auth': 'AuthController.createAuthAccount',
  'DELETE /auth/:id': {
    controller: 'AuthController',
    action: 'destroy'
  },
  'GET /auth/': 'AuthController.find',
  'PATCH /auth/:id': 'AuthController.update'
};
