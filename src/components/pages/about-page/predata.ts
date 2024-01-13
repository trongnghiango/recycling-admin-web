import { Group } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { getTextDataAfterDecryto, _base64ToArrayBuffer } from "@/utils/aesUtil";

/**
 * desc: Ham nay dung de giai ma from base64 ra thanh string
 * @param content
 * @returns
 */
export function getTextDataFromBase64(content: string): string | undefined {
  if (!!!content) return;
  const base64Content = content.replace("data:;base64,", "");
  const arrBuf = _base64ToArrayBuffer(base64Content);
  return getTextDataAfterDecryto(arrBuf)?.toString();
}

/**
 * desc: ham nay dung de cv dang string sang dang du lieu mesh or group using render 3d
 * @param text
 * @returns
 */
export function loadGroup3DFromText(text?: string): Group | undefined {
  if (!text) return;
  const myObj = new OBJLoader();
  return myObj.parse(text);
}

export function getBlobFromBase64(content: string): Blob | undefined {
  if (!!!content) return;
  const base64Content = content.replace("data:;base64,", "");
  const arrBuf = _base64ToArrayBuffer(base64Content);
  return new Blob([arrBuf]);
}

export function toArrayBuffer(buf: Buffer) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
