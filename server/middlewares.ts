import { NextFunction, Request, Response } from "express";
import { environment } from "./config";
import { ApiError, InternalError } from "./core/ApiError";
import logger from "./core/logger";

import ErrorResponse from "./interfaces/ErrorResponse";

export function notFound(req: Request, res: Response, next: NextFunction) {
  logger.info("Not Found");
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === "development") {
      logger.error(`err:: ${err}`);
      return res.status(statusCode).send({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      });
    }
    ApiError.handle(new InternalError(), res);
  }
}
