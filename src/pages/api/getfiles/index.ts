import stream, { Readable } from "stream";
import { promisify } from "util";
import fs from "fs-extra";
import serverPath from "utils/serverPath";
import { NextApiResponse } from "next";
import { decryptId } from "utils/aesUtil";

function is3dObjFile(filename: string) {
  const decName = decryptId(filename);
  if (!decName) return false;
  return decName.split(".")[1] == "obj";
}

const pipeline = promisify(stream.pipeline);

const handler = async (req: any, res: NextApiResponse) => {
  // here you can define period in second, this one is 5 minutes
  const period = 60 * 60 * 24 * 365;
  // console.log("api", req.query["user"]);
  const directoryPath = serverPath(`/uploads`);

  // you only want to cache for GET requests
  if (req.method == "GET") {
    res.setHeader("Cache-control", `public, max-age=${period}`);
  } else {
    // for the other requests set strict no caching parameters
    res.setHeader("Cache-control", `no-store`);
  }
  const { name, user } = req.query;
  const filePath = `${directoryPath}/${user}/${name}`;

  // const files = fs.readdirSync(directoryPath)
  // try {
  //   files.forEach(file => {
  //     const fileCnt = fs.readFileSync(`${directoryPath}/${file}`)
  //     // console.log(fileCnt )
  //   })
  // } catch (error) { console.log(error) }

  const file = fs.readFileSync(filePath);
  // console.log('FFF', file)

  // res.setHeader('Content-Type', 'application/octet-steam');
  res.status(200);
  // await pipeline(file, res);
  await pipeline(Readable.from(file), res);
  //   res.setHeader('Content-Disposition', 'attachment; filename=dummy.pdf');
  // const readStream = fs.createWriteStream(filePath);
  // // We replaced all the event handlers with a simple call to readStream.pipe()
  // readStream.pipe(res);
  // // res.json(filePath);
  // readStream.on('finish', () => {
  //   readStream.close();
  //   console.log('Download Completed');
  // })
};

export default handler;
