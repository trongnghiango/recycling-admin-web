import { Request } from "express";
import User from "../server/database/model/User";
import Keystore from "../server/database/model/Keystore";
import ApiKey from "../server/database/model/ApiKey";

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
