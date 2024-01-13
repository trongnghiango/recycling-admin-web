import developmentEnv from "@/environments/development";
import productionEnv from "@/environments/production";
import { IOrthodontics, IStep } from "@/state/interfaces/teeth.interface";
import { splitNumberFromString } from "@/utils/utils";
import { executeAllTasks, getBlobLink, getBlobLinkV2 } from "./aesUtil";
import { Octokit } from "@octokit/core";

export const getNumKeyFromNameString = (str: string): string => {
  const a = str.split(".")[0];
  const pieces = a.split("-");
  const last = pieces[pieces.length - 1];
  return last;
};

export const executeAllTasksGit = async (taskUrls: any[]) => {
  return await Promise.all(taskUrls.map(exeTaskGit));
};

export const exeTaskGit = async (url: string) => {
  const octokit = new Octokit();

  const res = await octokit.request(`GET ${url}`, {
    headers: {
      authorization:
        "token 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",
    },
  });
  return res.data;
};

export const getInitDataFromGit = async (p?: string): Promise<any> => {
  try {
    const octokit = new Octokit({ auth: productionEnv.token?.toString() });
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/decres",
      {
        owner: "laodaits9009",
        // owner: 'nghiango262',
        repo: p ?? "phongbd",
        // path: "public\/assets\/mmm1"
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error:: ko get duoc DATA...");
    return;
  }
};

export const syncDataFromGithubV2 = (files: any): any => {
  let obj = {};
  // console.log({ files })
  if (Array.isArray(files)) {
    for (const file of files) {
      //handle ..
      const [k] = splitNumberFromString(file.name) ?? ["0"];
      // console.log(file.download_url)
      if (k) {
        const key = k.toString();
        const maxillary = file.name.includes("mx-")
          ? `${file.download_url}`
          : undefined;
        const mxsize = file.name.includes("mx-") ? `${file.size}` : undefined;
        const mandibular = file.name.includes("mn-")
          ? `${file.download_url}`
          : undefined;
        const mnsize = file.name.includes("mn-") ? `${file.size}` : undefined;

        if (maxillary) {
          obj = {
            ...obj,
            [key]: { ...obj[key], maxillary, mxsize },
          };
        }

        if (mandibular) {
          obj = {
            ...obj,
            [key]: { ...obj[key], mandibular, mnsize },
          };
        }
      }
    }
    return obj;
  }
};

/**
 * fetchFileDataFromGit
 * @desc
 * @param data
 * @returns
 */
export const fetchFileDataFromGit = async (data: any): Promise<any> => {
  //const res = await getInitDataFromGit();
  //const data = syncDataFromGithubV2(res)
  if (!data || Object.values(data).length <= 3) return;

  const mxtasks: string[] = [];
  const mntasks: string[] = [];

  Object.keys(data).map((key) => {
    if (!!data[key]["maxillary"]) mxtasks.push(data[key]["maxillary"]);
    if (!!data[key]["mandibular"]) mntasks.push(data[key]["mandibular"]);
  });
  // const start = performance.now();
  // console.log({mxtasks, mntasks});
  const rMxTasks = await executeAllTasks(mxtasks);
  const urlMxList = rMxTasks.map((val, _idx) => getBlobLinkV2(val));
  // console.log({urlMxList});
  const rMnTasks = await executeAllTasks(mntasks);
  const urlMnList = rMnTasks.map((val, _idx) => getBlobLinkV2(val));
  // console.log({urlMnList});
  const len: number =
    rMxTasks.length > rMnTasks.length ? rMxTasks.length : rMnTasks.length;
  Object.keys(data).map((k, _idx) => {
    data[k]["maxillary"] = urlMxList[k];
    data[k]["mandibular"] = urlMnList[k];
  });
  //console.log(data)
  const end = performance.now();
  // const timeTaken = end - start;
  // console.log("Function took " + timeTaken + " milliseconds");
  return data;
};

const syncDataFromGithub = (files: any): any => {
  let obj = {};
  // let keys: string[] = [];
  if (Array.isArray(files)) {
    files.forEach((file) => {
      //handle ..
      const key = getNumKeyFromNameString(file.name);
      if (key) {
        const maxillary =
          file.name.includes(".obj") && file.name.includes("Maxillary")
            ? `${file.download_url}`
            : undefined;
        const mandibular =
          file.name.includes(".obj") && file.name.includes("Mandibular")
            ? `${file.download_url}`
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
    return obj;
  }
};

const forLoop = async (
  data: any
): Promise<{ links: any; test: any; mandibular: any; maxillary: any }> => {
  // console.log('Start');
  const maxillary = {}; // Ham tren
  const mandibular = {}; // Ham duoi
  const links: string[] = [];
  for (let index = 0; index < data.length; index++) {
    const { typeKey, step } = getItemKey(data[index].name);
    //console.log(data[index])
    const link = data[index].download_url;
    //const item = await getFile(data[index].download_url);
    // console.log('Finished::', data[index].name);
    //if (item === null) break;
    if (typeKey === "Maxillary") {
      maxillary[step] = link;
    } else if (typeKey === "Mandibular") {
      mandibular[step] = link;
    }
  }

  let temp;
  if (links.length > 0) temp = await getFile(links[0]);

  return { maxillary, mandibular, links, test: temp };
};

async function getFile(link: string) {
  const response = await fetch(link);
  if (response && response.status === 200) {
    const result = await response.blob();
    return URL.createObjectURL(result);
  }
  return null;
}

//parse ten file va lay stt lam key
export function getItemKey(str: string) {
  const a = str.split(".")[0];
  const pieces = a.split("-");
  const first = pieces[0];
  const last = pieces[pieces.length - 1];

  return { typeKey: first, step: parseInt(last) };
}

export const fetchFileData = async (arr: string[]) => {
  try {
    const res = await Promise.all(arr.map((val) => fetch(val)));
    const data = await Promise.all(
      res.map((r) => {
        return r.blob();
      })
    );
    return data;
  } catch (err) {
    console.error(err);
    //throw Error("Promise failed", err);
  }
};
