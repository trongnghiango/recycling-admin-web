import Joi from "joi";
import { JoiObjectId } from "../../helpers/validator";

export default {
  patientCreater: Joi.object().keys({
    patient_id: Joi.string().required().min(3),
    name: Joi.string().required().min(1),
    profilePicUrl: Joi.string().min(1),
    email: Joi.string().required().min(1),
    birthday: Joi.string().min(1),
    gender: Joi.string().min(1),
    url: Joi.string().min(1),
    followedByDoctor: Joi.string().min(1),
    clinic_at: Joi.string().min(1),
    start_date: Joi.string().min(1),
    status: Joi.string().min(1),
    notes: Joi.string().min(1),
    treatment_option: Joi.string().min(1),
  }),
};
