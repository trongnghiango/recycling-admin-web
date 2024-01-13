import { IOrthodontics, IStep } from "@/state/interfaces/teeth.interface";
import {
  decryptId,
  getBlobLinkV2,
  getBlobLinkV3,
  getTextDataAfterDecryto,
} from "@/utils/aesUtil";
import { splitNumberFromString } from "@/utils/utils";

export const getSingleFile = async ({
  userId,
  encoded_name,
}: {
  userId: string;
  encoded_name: string;
}) => {
  const res = await fetch(
    `/api/getfiles?user=${userId}&name=${encodeURIComponent(encoded_name)}`
  ).then((response) => response.arrayBuffer());
  // const blobUrl = getBlobLinkV3(res);
  const text = getTextDataAfterDecryto(res);
  return {
    name: encoded_name,
    size: res.byteLength,
    // blobUrl,
    content: text,
  };
};

export const getSingleFileV2 = async ({
  userId,
  encoded_name,
}: {
  userId: string;
  encoded_name: string;
}) => {
  const res = await fetch(
    `/api/getfiles?user=${userId}&name=${encodeURIComponent(encoded_name)}`
  ).then((response) => response.arrayBuffer());
  // const blobUrl = getBlobLinkV2(res);
  const content = getTextDataAfterDecryto(res);
  return {
    name: encoded_name,
    size: res.byteLength,
    // blobUrl,
    content,
  };
};

export const getMultiFiles = async ({
  patientId,
  inputList,
}: {
  patientId: string;
  inputList: any[];
}) => {
  return await Promise.all(
    inputList.map((value, _idx) =>
      getSingleFile({ userId: patientId, encoded_name: value })
    )
  );
};

export function getDataFromLocal(data: any[]) {
  let dataRes: IOrthodontics<IStep> = {};

  for (const { name, size, blobUrl } of data) {
    const decname = decryptId(name) ?? "";

    const [key] = splitNumberFromString(decname) ?? ["0"];
    if (!!decname && !!key) {
      const maxillary =
        decname.includes("mx-") || decname.includes("Maxillary-")
          ? blobUrl
          : undefined;
      const mandibular =
        decname.includes("mn-") || decname.includes("Mandibular-")
          ? blobUrl
          : undefined;

      if (maxillary) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], maxillary },
        };
      }

      if (mandibular) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], mandibular },
        };
      }
    }
  }
  return dataRes;
}

export function getDataFromLocalV2(data: any[]) {
  let dataRes: IOrthodontics<IStep> = {};

  for (const { name, size, content } of data) {
    const decname = decryptId(name) ?? "";

    const [key] = splitNumberFromString(decname) ?? ["0"];
    if (!!decname && !!key) {
      const maxillary =
        decname.includes("mx-") || decname.includes("Maxillary-")
          ? content
          : undefined;
      const mandibular =
        decname.includes("mn-") || decname.includes("Mandibular-")
          ? content
          : undefined;

      if (maxillary) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], maxillary },
        };
      }

      if (mandibular) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], mandibular },
        };
      }
    }
  }
  return dataRes;
}

/**
 * Sync Data
 * @param dataSource
 * @returns
 */
export const syncData = (dataSource: IOrthodontics<IStep>) => {
  if (!dataSource)
    return { stepsData: {}, length: 0, manLength: 0, maxLength: 0 };
  let maxCnt = 0,
    manCnt = 0,
    len = 0;
  const manFlag: any[] = [];

  for (const key in dataSource) {
    // if (dataSource.hasOwnProperty(key)) {

    if (!!dataSource[key]["maxillary"]) {
      // dataSource[key]["maxillary"] = changePathFolder(
      //   dataSource[key]["maxillary"]
      // );
      if (parseInt(key) > maxCnt) maxCnt++; // = parseInt(key);
      if (parseInt(key) > len) len = parseInt(key);
    }

    if (!!dataSource[key]["mandibular"]) {
      // dataSource[key]["mandibular"] = changePathFolder(
      //   dataSource[key]["mandibular"]
      // ); //.replace('./public', '');
      if (manCnt < parseInt(key)) manCnt++; //= parseInt(key);
      if (parseInt(key) > len) len = parseInt(key);
    }
    // }
  }

  for (const key in dataSource) {
    if (dataSource.hasOwnProperty(key)) {
      if (!!!dataSource[key]) {
        // console.log(dataSource[`${i}`]?.mandibular, dataSource[`${i}`]?.maxillary)
        dataSource[key] = {};
      }
    }
  }
  // start: fix error len and key khong tuong thich
  for (let i = 0; i <= len; i++) {}

  // end: fix error len and key khong tuong thich

  // Iterate through the object
  for (const key in dataSource) {
    if (dataSource.hasOwnProperty(key) && !dataSource[key]["maxillary"]) {
      dataSource[key]["maxillary"] =
        dataSource[`${parseInt(key) - 1}`]["maxillary"];
      dataSource[key]["noMax"] = true;
    }

    if (dataSource.hasOwnProperty(key) && !dataSource[key]["mandibular"]) {
      dataSource[key]["mandibular"] =
        dataSource[`${parseInt(key) - 1}`]["mandibular"];
      dataSource[key]["noMan"] = true;
    }
  }

  // console.log("DDDD:::", { dataSource });
  return {
    stepsData: dataSource,
    length: len,
    maxLength: maxCnt,
    manLength: manCnt,
  };
};

/**
 * func convert path (remove public string)
 * @param originalPath
 * @returns
 */
const changePathFolder = (originalPath?: string) => {
  if (!originalPath) return;
  return originalPath.includes("/public")
    ? originalPath.replace("./public", "")
    : originalPath;
};
