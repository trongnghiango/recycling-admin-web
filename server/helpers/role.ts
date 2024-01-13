import { RoleCode } from "../database/model/Role";
import { RoleRequest } from "../../types/app-request";
import { Response, NextFunction } from "express";

export default (...roleCodes: RoleCode[]) =>
  (req: RoleRequest, res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes;
    next();
  };
