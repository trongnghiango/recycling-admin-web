import express from "express";
import { ProtectedRequest } from "../../../types/app-request";
import schema from "./schema";
import { Types } from "mongoose";
import authentication from "../../auth/authentication";
import role from "../../helpers/role";
import { RoleCode } from "../../database/model/Role";
import authorization from "../../auth/authorization";
import validator, { ValidationSource } from "../../helpers/validator";
import asyncHandler from "../../helpers/asyncHandler";
import ClinicRepo from "../../database/repository/ClinicRepo";
import Clinic from "../../database/model/Clinic";
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse";
import logger from "../../core/logger";
import { BadRequestError } from "../../core/ApiError";

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.LEARNER), authorization);
//----------------------------------------------------------------

router.post(
  "/create",
  validator(schema.clinicCreater, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    
    const createdClinic = await ClinicRepo.create({
      clinicCode: req.body.clinicCode,
      name: req.body.name,
      address: req.body.address,
      hotline: req.body.hotline,
      email: req.body.email,
      description: req.body.description,
      createdBy: req.user,
      updatedBy: req.user,
    } as Clinic);
    logger.warn(`Clinic:: [${req.body.name}] created by ${req.user.email}`)
    new SuccessResponse("Clinic created successfully", createdClinic).send(res);
  })
);

router.get(
  "/all",
  asyncHandler(async (req: ProtectedRequest, res) => {
    const clinics = await ClinicRepo.findAll();
    new SuccessResponse("Success", clinics).send(res);
  })
);

router.delete(
  "/id/:id",
  validator(schema.clinicCode, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    logger.info(`ID::: ${req.params.id}`);
    const clinic = await ClinicRepo.findClinicById(
      new Types.ObjectId(req.params.id)
    );
    if (!clinic) throw new BadRequestError("Clinic does not exists");
    clinic.status = false;

    await ClinicRepo.update(clinic);
    logger.warn(`Clinic:: [${req.params.id}] updated by ${req.user.email}`)
    return new SuccessMsgResponse("Clinic deleted successfully").send(res);
  })
);

router.put(
  '/editor/:id',
  validator(schema.clinicCode, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const clinic = await ClinicRepo.findClinicById(
      new Types.ObjectId(req.params.id),
    );

    if (!clinic) throw new BadRequestError('Clinic does not exists');

    if (req.body.description) clinic.description = req.body.description;
    if (req.body.name) clinic.name = req.body.name;
    // ...

    await ClinicRepo.update(clinic);
    return new SuccessMsgResponse('Blog published successfully').send(res);
  }),
);

export default router;
