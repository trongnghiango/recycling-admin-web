import path from "path";
import { readFile } from "fs";
import { promisify } from "util";
import { sign, verify } from "jsonwebtoken";
import { InternalError, BadTokenError, TokenExpiredError } from "./ApiError";
import Logger from "./logger";
import logger from "./logger";

/*
 * issuer 		— Software organization who issues the token.
 * subject 		— Intended user of the token.
 * audience 	— Basically identity of the intended recipient of the token.
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;

  constructor(
    issuer: string,
    audience: string,
    subject: string,
    param: string,
    validity: number
  ) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = param;
  }
}

async function readPublicKey(): Promise<string | null> {
  try {
    return promisify(readFile)(
      path.join(__dirname, "../../keys/public.pem"),
      "utf8"
    );
  } catch (error: any) {
    logger.error(`readPrivateKey::${error.message}`);
    return null;
  }
}

async function readPrivateKey(): Promise<string | null> {
  try {
    return promisify(readFile)(
      path.join(__dirname, "../../keys/private.pem"),
      "utf8"
    );
  } catch (error: any) {
    logger.error(`readPrivateKey::${error.message}`);
    return null;
  }
}

async function encode(payload: JwtPayload): Promise<string | null> {
  try {
    logger.info(`[encode]:: payload -- ${JSON.stringify(payload, null, 2)}`);
    const cert = await readPrivateKey();
    if (!cert) {
      throw new BadTokenError("Error:: cannot cert file.");
    }
    return sign({ ...payload }, cert, { algorithm: "RS256" });
  } catch (error: any) {
    logger.error(`encode:: error -- ${error.message}`);
    throw new BadTokenError("Error::encode");
  }
}

/**
 * This method checks the token and returns the decoded data when token is valid in all respect
 */
async function validate(token: string): Promise<JwtPayload> {
  try {
    const cert = await readPublicKey();
    if (!cert) {
      throw new BadTokenError("Error:: cannot cert file.");
    }
    // @ts-ignore
    return (await promisify(verify)(token, cert)) as JwtPayload;
  } catch (e: any) {
    Logger.debug(`ERROR: validate - ${e}`);
    if (e && e.name === "TokenExpiredError")
      throw new TokenExpiredError(e.message);
    // throws error if the token has not been encrypted by the private key
    throw new BadTokenError(e.message);
  }
}

/**
 * Returns the decoded payload if the signature is valid even if it is expired
 */
async function decode(token: string): Promise<JwtPayload> {
  const cert = await readPublicKey();
  try {
    // @ts-ignore
    return (await promisify(verify)(token, cert, {
      ignoreExpiration: true,
    })) as JwtPayload;
  } catch (e: any) {
    Logger.debug(`ERROR [encode]:: ${e.message}`);
    throw new BadTokenError(e.message);
  }
}

export default {
  encode,
  validate,
  decode,
};
