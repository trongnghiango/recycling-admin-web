import express from "express";
import { ProtectedRequest } from "../../../types/app-request";
import { SuccessResponse } from "../../core/ApiResponse";
import asyncHandler from "../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../helpers/validator";
import schema from "./schema";
import { BadRequestError } from "../../core/ApiError";
import role from "../../helpers/role";
import authentication from "../../auth/authentication";
import authorization from "../../auth/authorization";
import { RoleCode } from "../../database/model/Role";
import PatientRepo from "../../database/repository/PatientRepo";
import Patient from "../../database/model/Patient";
import _ from "lodash";
// import Logger from '../../core/logger';
import { Types } from "mongoose";
import logger from "../../core/logger";

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.LEARNER), authorization);
//----------------------------------------------------------------
router.get(
  "/all",
  asyncHandler(async (_req: ProtectedRequest, res) => {
    const patients = await PatientRepo.findAll();
    new SuccessResponse("Success", patients).send(res);
  })
);

router.get(
  "/q",
  asyncHandler(async (_req: ProtectedRequest, res) => {
    const patients = await PatientRepo.findAll();
    new SuccessResponse("Success", patients).send(res);
  })
);

router.post(
  "/create",
  validator(schema.patientCreater, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdPatient = await PatientRepo.create({
      patient_id: req.body.patient_id,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      start_date: new Date(req.body.start_date),
      birthday: new Date(req.body.birthday),
      notes: req.body.notes || "",
      treatment_option: req.body.treatment_option || "",
      followedByDoctor: req.body.followedByDoctor || "",
      clinic_at: req.body.clinic_at || "OTHERS",
      status: req.body.status,
      createdBy: req.user,
      updatedBy: req.user,
    } as Patient);

    logger.info(`Patient:: [name: ${req.body.name} -- ID: ${req.body.patient_id}] created by [user: ${req.user.email}]`)

    new SuccessResponse("Patient created successfully", createdPatient).send(
      res
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: ProtectedRequest, res) => {
    const patient = await PatientRepo.findById(
      new Types.ObjectId(req.params.id)
    );
    if (!patient) throw new BadRequestError("Patient not registered");

    return new SuccessResponse(
      "success",
      // patient
      _.pick(patient, [
        "name",
        "email",
        "status",
        "id",
        "start_date",
        "treatment_option",
        "notes",
      ])
    ).send(res);
  })
);

export default router;
