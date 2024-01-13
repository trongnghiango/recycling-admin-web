import express from "express";
import { ProtectedRequest } from "../../../types/app-request";
import authentication from "../../auth/authentication";
import authorization from "../../auth/authorization";
import role from "../../helpers/role";
import { RoleCode } from "../../database/model/Role";
import schema from "./schema";
import validator, { ValidationSource } from "../../helpers/validator";
import asyncHandler from "../../helpers/asyncHandler";
import { SuccessResponse } from "../../core/ApiResponse";
import DoctorRepo from "../../database/repository/DoctorRepo";
import Doctor from "../../database/model/Doctor";
import logger from "../../core/logger";

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.LEARNER), authorization);
//----------------------------------------------------------------

router.post(
  "/create",
  validator(schema.doctorCreater, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdDoctor = await DoctorRepo.create({
      doctor_id: req.body.doctor_id,
      name: req.body.name,
      profilePicUrl: req.body.profilePicUrl || "",
      email: req.body.email || "",
      birthday: req.body.birthday || "",
      clinicCode: req.body.clinicCode || "",
      phone: req.body.phone || "",
      createdBy: req.user,
      updatedBy: req.user,
    } as Doctor);
    logger.info(`Doctor:: [name: ${req.body.name}] created by [user: ${req.user.email}]`)
    new SuccessResponse("Success", createdDoctor).send(res);
  })
);

router.get(
  "/all",
  asyncHandler(async (req: ProtectedRequest, res) => {
    const doctors = await DoctorRepo.findAll();
    new SuccessResponse("Success", doctors).send(res);
  })
);

router.get(
  "/clinic/:clinicCode",
  validator(schema.doctorByClinic, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const doctors = await DoctorRepo.findDoctorsByClinic({
      clinicCode: req.params.clinicCode,
    });
    new SuccessResponse("Success", doctors).send(res);
  })
);

export default router;
