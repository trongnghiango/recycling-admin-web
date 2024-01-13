import express, { NextFunction, Request, Response } from "express";
import {
  AuthFailureError,
  InternalError,
  NotFoundError,
} from "../core/ApiError";
import multer from "multer";
import fs from "fs-extra";
import logger from "../core/logger";
import path from "path";
import getConfig from "next/config";
import stream, { Readable } from "stream";
import { promisify } from "util";

interface CustomFilesRequest extends Request {
  files: Express.Multer.File[];
}

const router = express.Router();
const outputFolderName = (userId?: string) => `uploads/${userId}`;

const pipeline = promisify(stream.pipeline);

// Image Upload
const fileStorage = multer.diskStorage({
  destination: (req: any, _file, cb) => {
    const path = `${outputFolderName(req.query["userId"].toString())}`;
    logger.info(path);
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  },
});

const fileUpload = multer({
  storage: fileStorage,
});

router.post(
  "/test",
  () => {},
  fileUpload.array("theFiles"),
  (req: Request, res: Response) => {
    // console.log(req)
    if (!req.files) {
      throw new NotFoundError("Éo tìm thấy File nào hết nhé bạn...");
    }
    logger.info(JSON.stringify(req.files));
    const files = req.files;

    res.json({ status: "success", path: JSON.stringify(files) });
  }
);

router.get("/test", (req: Request, res: Response) => {
  const { query } = req;

  // console.log('API[TEST] userId::', req['query'].userId)
  const userId = (query.userId ?? "").toString();

  const dir = path.join(require("path").resolve("./"), "./uploads", userId);

  console.log({ dir });

  const filenames = fs.readdirSync(dir);

  res.statusCode = 200;
  res.json({ data: filenames });
});

router.get("/getfiles", async (req: any, res: Response) => {
  // here you can define period in second, this one is 5 minutes
  const period = 60 * 60 * 24 * 365;
  // console.log("api", req.query["user"]);
  const directoryPath = path.join(require("path").resolve("./"), "./uploads");

  // you only want to cache for GET requests
  if (req.method == "GET") {
    res.setHeader("Cache-control", `public, max-age=${period}`);
  } else {
    // for the other requests set strict no caching parameters
    res.setHeader("Cache-control", `no-store`);
  }
  const { name, user } = req.query;
  const filePath = `${directoryPath}/${user}/${name}`;
  

  const file = fs.readFileSync(filePath);
  console.log('File after readFileSync', file)

  // res.setHeader('Content-Type', 'application/octet-steam');
  res.status(200);
  // await pipeline(file, res);
  await pipeline(Readable.from(file), res);
});

export default router;
