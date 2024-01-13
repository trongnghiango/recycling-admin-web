// ts-prune-ignore-next
const { readdir, copyFile } = require("fs").promises;
const { resolve } = require("path");

export const renameAndChangeFileList = async (
  dirName: string,
  desDirName: string
) => {
  const extName = "obj";
  let files: any = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [
        ...files,
        ...(await renameAndChangeFileList(
          `${dirName}/${item.name}`,
          `${desDirName}`
        )),
      ];
    } else {
      const thenum = dirName.match(/\d+/);
      if (item.name.split(".")[1] === extName) {
        if (thenum) console.log("Step::", thenum[0]);
        // console.log('DirPath::', dirName);
        const desFilePath = `${desDirName}/${item.name.split(".")[0]}${
          thenum ? "-" + thenum : ""
        }.${extName}`;
        await copyFile(`${dirName}/${item.name}`, desFilePath);
        // console.log('File::', item.name);
        // console.log('==================END===================\n');
        files.push(desFilePath);
      }
    }
  }
  return files;
};

/**
 *
 * A function that performs no operations.
 *
 * ts-prune-ignore-next
 */
export const noop = Function.prototype as <T>(...params: T[]) => T;

/**
 * ts-prune-ignore-next
 */
export const uniq = <T>(array: T[]): T[] => Array.from(new Set(array));

/**
 * ts-prune-ignore-next
 */
export const delay = (durationInMilliseconds = 250): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, durationInMilliseconds));
};

//parse ten file va lay stt lam key
//example: Mandibular-1.stl -> 1
export const getNumKeyFromNameString = (str: string): string => {
  const a = str.split(".")[0];
  const pieces = a.split("-");
  const last = pieces[pieces.length - 1];
  return last;
};
