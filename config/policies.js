/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
const onlyFetch = {
  find: true,
  create: ['isAuthenticated', 'isAdmin'],
  update: ['isAuthenticated', 'isAdmin'],
  destroy: ['isAuthenticated', 'isAdmin']
};

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  AuthController: {
    createAuthAccount: ['isAuthenticated', 'isAdmin'],
    destroy: ['isAuthenticated', 'isAdmin'],
    find: ['isAuthenticated', 'isAdmin'],
    update: ['isAuthenticated', 'isAdmin'],
    login: true,
    register: true
  },
  PublicController: { ...onlyFetch },
  CRUDController: {
    '*': ['isAuthenticated', 'isAdmin']
  }
};
