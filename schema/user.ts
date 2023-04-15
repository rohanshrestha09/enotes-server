import Joi from "joi";
import { Provider } from "@prisma/client";

const UserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(8).max(16).required(),
  confirmPassword: Joi.valid(Joi.ref("password")).required(),
  image: Joi.binary(),
  imageName: Joi.string(),
  bio: Joi.string(),
  social: Joi.object({
    facebook: Joi.string().domain(),
    google: Joi.string().domain(),
  }),
  provider: Joi.string().valid(...Object.values(Provider)),
});

export default UserSchema;
