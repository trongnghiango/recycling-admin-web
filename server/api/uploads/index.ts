import { Request, Response, Router } from "express";
import multer from "multer";
import logger from "../../core/logger";
import fs from "fs-extra";
import { NotFoundError } from "../../core/ApiError";

const router = Router();
const outputFolderName = (clinicCode?: string) => `public/assets/images/`;

// Image Upload
const fileStorage = multer.diskStorage({
  destination: (req: any, _file, cb) => {
    let path = `${outputFolderName(req.query['clinicCode'].toString())}`;
    logger.info(path)
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  }
});

const fileUpload = multer({
  storage: fileStorage,

})


router.get("/", (_req, res) => {
  res.json(["😀", "😳", "🙄"]);
});

router.post("/logo", fileUpload.array("thePhoto"), (req: Request, res: Response) => {
  // console.log(req)
  if (!req.files) {
    throw new NotFoundError("Éo tìm thấy File nào hết nhé bạn...");
  }
  logger.info(JSON.stringify(req.files));
  const files = req.files;

  res.json({ status: "success", path: JSON.stringify(files) });

});

export default router;