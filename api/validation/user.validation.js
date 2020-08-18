const Joi = require('joi');
const authAccount = {
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().min(8).required()
};

module.exports = {
  userRegister: {
    body: Joi.object({
      ...authAccount,
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
  },
  userLogin: {
    body: Joi.object({
      ...authAccount
    })
  },

  createAuth: Joi.object({
    ...authAccount,
    role: Joi.string()
      .valid('super', 'admin', 'member', 'normal')
      .default('normal')
  })
};
