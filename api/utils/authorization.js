module.exports = function(roles, req, res) {
  const blockRequest = function() {
    res.status(403).json({
      message:
        'You are not authorized to do this action. Please, contact system admins.'
    });
    return false;
  };

  if (!req.currentUser || !req.currentUser.role) {
    return blockRequest();
  }
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  if (roles.includes(req.currentUser.role)) {
    return true;
  } else {
    return blockRequest();
  }
};
// FIXME: Remove, not used anymore.
// moved to config folder instead;
// for global access through sails app reference
