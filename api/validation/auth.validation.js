const Joi = require('joi');
const authAccount = Joi.object({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
}).required();
module.exports = {
  userRegister: {
    body: {
      auth: authAccount,
      userProfile: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().allow(null),
        phone: Joi.string().allow(null),
        countryCode: Joi.string().allow(null),
        address: Joi.string().allow(null),
        gender: Joi.string()
          .valid('male', 'female', 'other')
          .required(),
        birthdate: Joi.date().allow(null)
      }).required()
    }
  },
  userLogin: {
    body: authAccount
  },

  createAuth: {
    ...authAccount,
    role: Joi.string()
      .valid('super', 'admin', 'member', 'normal')
      .default('normal')
  }
};
