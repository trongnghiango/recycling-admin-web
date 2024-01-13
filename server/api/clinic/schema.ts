import Joi from "joi";
import { JoiObjectId } from "../../helpers/validator";

export default {
  clinicCreater: Joi.object().keys({
    clinicCode: Joi.string().required().min(3),
    name: Joi.string().required().min(1),

    address: Joi.string().allow('').optional(),
    hotline: Joi.string().allow('').optional(),
    email: Joi.string().email(),
    //
    description: Joi.string().allow('').optional(),
    notes: Joi.string().min(1),
  }),
  clinicCode: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
