import Joi from "joi";
import { JoiObjectId } from "../../helpers/validator";

export default {
  doctorCreater: Joi.object().keys({
    doctor_id: Joi.string().required().min(2),
    name: Joi.string().required().min(2),
    email: Joi.string().min(2),
    phone: Joi.string().allow('').optional(),
    clinicCode: Joi.string().min(2),
    profilePicUrl: Joi.string().min(2),
    birthday: Joi.string().min(2),
  }),
  doctorByClinic: Joi.object().keys({
    clinicCode: Joi.string().min(3),
  }),
};
