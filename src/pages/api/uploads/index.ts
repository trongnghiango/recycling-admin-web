import next, { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs-extra";
import { ApiResponse } from "../../../models/ApiResponse";
import {
  getNumKeyFromNameString,
  renameAndChangeFileList,
} from "utils/misc.utils";

import Cors from "cors";
import { splitNumberFromString } from "utils/utils";
import { encrypt, encryptId, _encrypt } from "utils/aesUtil";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  allowedHeaders: ["access-control-allow-origin: *"],
  methods: ["POST", "GET", "PUT", "HEAD", "DELETE"],
});
interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}

type ResponseData = ApiResponse<string[] | any, string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = (userId?: string) => `./uploads/${userId}`;

function copyFile(source: string, destination: string) {
  const input = fs.createReadStream(source);
  const output = fs.createWriteStream(destination);
  return new Promise((resolve, reject) => {
    output.on("error", reject);
    input.on("error", reject);
    input.on("end", resolve);
    input.pipe(output);
  });
}

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextConnectApiRequest,
  res: NextApiResponse,
  fn: any
) {
  // console.log(req['files'])
  // Khi nguoi dung upload file thi file se nhan tai day.
  // Ta co the encryto file data tai day
  const { files } = req;
  const dir = `${outputFolderName(req.query["userId"]?.toString())}`;
  // const dir = outputFolderName('nghiadt')
  console.log("dir::", dir, fs.existsSync(dir));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  //delete thu muc truoc khi up
  fs.emptyDirSync(dir);

  if (files) {
    for (const file of files) {
      // chunk is the Uint8Array object
      //ma hoa file name
      const fileName = encryptId(file.originalname);
      const path = dir + "/" + fileName;
      //ma hoa
      const desFile = encrypt(file.buffer, "ciquan");
      fs.appendFileSync(path, desFile);
      // console.log('write...')
    }
  }

  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const storageM = multer.memoryStorage();

const storage = multer.diskStorage({
  destination: function (req: any, _file, cb) {
    const path = `${outputFolderName(req.query["userId"].toString())}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (_req, file, cb) {
    const filename = file.originalname;
    // const fileExtension = filename.split('.')[1];
    cb(null, filename);
  },
});

const upload = multer({ storage: storageM });

const apiRoute = nextConnect({
  onError(
    error,
    _req: NextConnectApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(cors);

apiRoute.use(upload.array("theFiles"));

apiRoute.use((req: any, res: any, next: any) =>
  runMiddleware(req, res, () => next())
);

apiRoute.post(
  (req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
    // console.log("Req:::", req.files);

    const filenames = fs.readdirSync(
      outputFolderName(req.query["userId"]?.toString())
    );
    const file = filenames.map((name) => name);
    // console.log({ files });
    res.status(200).json({ data: file });
  }
);

apiRoute.delete(function (req: any, res: NextApiResponse<ResponseData>) {
  if (!req.query.fileName) {
    // console.log('No file received');
    res.status(500).json({ error: "Error! in image delete." });
  } else {
    // console.log('file received');
    // console.log(req.query.fileName);
    const { userId, fileName } = req.query;
    try {
      fs.unlinkSync(
        `${outputFolderName(userId.toString())}/${fileName.toString()}`
      );
      // console.log('successfully deleted /tmp/hello', { userId, fileName });
      res.status(200).json({
        data: {
          userId,
          deletedFileName: fileName,
          msg: "Detele Successful!!!",
        },
      });
    } catch (err: any) {
      // handle the error
      res.status(400).json({ error: err.message });
    }
  }
});

interface IStep {
  maxillary: string | undefined;
  mandibular: string | undefined;
}
interface IOrthodontics<IStep> {
  [Key: string]: IStep; // Key tuong duong voi step
}

apiRoute.get((req: any, res: NextApiResponse<ApiResponse<any>>) => {
  const directoryPath = outputFolderName(req.query["userId"].toString());
  console.log({ directoryPath });
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(404).json({
        error: "Unable to scan files!" + err,
      });
    } else {
      let obj: IOrthodontics<IStep> = {};
      // let keys: string[] = [];
      if (Array.isArray(files)) {
        files.forEach((file) => {
          //handle ..
          const [key] = splitNumberFromString(file) ?? ["0"];

          if (key) {
            const maxillary =
              file.includes(".obj") && file.includes("Maxillary")
                ? `${outputFolderName(req.query["userId"])}/${file}`
                : undefined;
            const mandibular =
              file.includes(".obj") && file.includes("Mandibular")
                ? `${outputFolderName(req.query["userId"])}/${file}`
                : undefined;

            if (maxillary) {
              obj = {
                ...obj,
                [key]: { ...obj[key], maxillary },
              };
            }

            if (mandibular) {
              obj = {
                ...obj,
                [key]: { ...obj[key], mandibular },
              };
            }
          }
        });
      }
      //console.log({obj});
      res.status(201).json({ data: obj });
    }
  });
});

export default apiRoute;
