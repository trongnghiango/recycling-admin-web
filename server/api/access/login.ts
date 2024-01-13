import express from "express";
import { SuccessResponse } from "../../core/ApiResponse";
import crypto from "crypto";
import UserRepo from "../../database/repository/UserRepo";
import { BadRequestError, AuthFailureError } from "../../core/ApiError";
import KeystoreRepo from "../../database/repository/KeystoreRepo";
import { createTokens } from "../../auth/authUtils";
import validator from "../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../helpers/asyncHandler";
import bcrypt from "bcrypt";
import { getUserData } from "./utils";
import { PublicRequest } from "../../../types/app-request";
import { testDB } from "../../database/init.multi.mongo";
import Logger from "../../core/logger";

const router = express.Router();

router.post(
  "/basic",
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    Logger.info(`[SignIn] from client:: ${req.body.email}`);
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) {
      Logger.info(`[SignIn]::\[${req.body.email}\]:: User not registered`);
      throw new BadRequestError("User not registered");
    }
    if (!user.password) {
      Logger.info(`[SignIn]::\[${req.body.email}\]:: NoPass!!`);
      throw new BadRequestError("Credential not set");
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      Logger.info(`[SignIn]::\[${req.body.email}\]:: WrongPass!!`);
      throw new AuthFailureError("Authentication failure");
    }

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    Logger.info(
      `[SignIn]::\[${req.body.email}\]:: accessTokenKey, refreshTokenKey`
    );

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);

    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    Logger.info(`[SignIn]::\[${req.body.email}\]:: createdTokens:: ${tokens}`);

    const userData = await getUserData(user);
    Logger.info(
      `[SignIn]::\[${req.body.email}\]:: userData ${JSON.stringify(
        userData.name
      )}`
    );

    new SuccessResponse("Login Success", {
      user: userData,
      tokens: tokens,
    }).send(res);
  })
);

export default router;
