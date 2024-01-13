import { promises as fs } from "fs";
import path from "path";
import {
  decrypt,
  decryptId,
  getBlobLinkV2,
  getTextDataAfterDecryto,
} from "./aesUtil";
import { splitNumberFromString } from "./utils";

const readData = async (dir: string) => {
  const dataDirectory = path.join(process.cwd(), dir);
  console.log(dataDirectory);
  const filenames = await fs.readdir(dataDirectory);

  const dataItems = filenames.map(async (filename) => {
    const filePath = path.join(dataDirectory, filename);
    const fileContents: Buffer = await fs.readFile(filePath);
    const text = getTextDataAfterDecryto(fileContents);
    // const parsedItem = JSON.parse(fileContents);
    // if (!!parsedItem) return parsedItem;
    // const res = decrypt(fileContents, "ciquan");

    return {
      textContent: text,
      filename,
      size: fileContents.byteLength,
    };
  });
  return {
    data: await Promise.all(dataItems),
  };
};

export default readData;
