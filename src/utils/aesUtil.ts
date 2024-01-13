// load the build-in crypto functions
import _crypto from "crypto";
import productionEnv from "@/environments/production";
import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import developmentEnv from "@/environments/development";
const algorithm = "aes-256-ctr";
import blobUtil from "blob-util";

export const encryptFileName = (originalName: string) => {
  return encryptId(originalName);
};

export const decryptFileName = (encodeName: string) => {
  return decryptId(encodeName);
};

export const encryptId = (str: string) => {
  const ciphertext = AES.encrypt(str, "secretPhongBoDoVKL");
  return encodeURIComponent(ciphertext.toString());
};

export const encryptTest = (str: string) => {
  const enc = encrypt(Buffer.from(str), "secretPhongBoDoVKL");
  return enc;
};

export const getUrl = (page: string, id: string) => {
  const encryptedId = encryptId(id);
  const host = productionEnv.isProduction
    ? productionEnv.host
    : developmentEnv.host;

  return `${host}/${page}/${encryptedId}`;
};

export const decryptId = (str: string) => {
  try {
    const decodedStr = decodeURIComponent(str);
    return AES.decrypt(decodedStr, "secretPhongBoDoVKL").toString(enc.Utf8);
  } catch (error: any) {
    console.error("Error::", error.message);
    return;
  }
};

export const encrypt = (buf: Buffer, secret: string): Buffer => {
  const key = _crypto
    .createHash("sha256")
    .update(secret)
    .digest("base64")
    .substr(0, 32);

  const iv = _crypto.randomBytes(16);

  const cipher = _crypto.createCipheriv(algorithm, key, iv);

  const result = Buffer.concat([iv, cipher.update(buf), cipher.final()]);

  return result;
};

export const decrypt = (buf: Buffer, secret: string): Buffer => {
  const key = _crypto
    .createHash("sha256")
    .update(secret)
    .digest("base64")
    .substr(0, 32);

  const iv = buf.slice(0, 16);

  const encrypted = buf.slice(16);

  const decipher = _crypto.createDecipheriv(algorithm, key, iv);

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return result;
};

export const downloadBlob = function (
  data: Uint8Array,
  fileName: string,
  mimeType: any
) {
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

export const toArrayBuffer = (text: string) => {
  const enc = new TextEncoder(); // always utf-8
  return enc.encode(text).buffer;
};

const downloadURL = function (data: string, fileName: string) {
  const a: any = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = "display: none";
  a.click();
  a.remove();
};

const downloadEnData = (ipData: Buffer, fileName: string) => {
  downloadBlob(ipData, fileName, "application/octet-stream");
};

/**
 * func: fetchArrayBufferData
 * @param url
 * @returns
 */
export const fetchArrayBufferData = async (
  url: string
): Promise<ArrayBuffer | undefined> => {
  const response = await fetch(url, {
    headers: {
      // 'Accept': 'application/vnd.github.raw',
      // 'Content-Type': ' application/json',
      // "Access-Control-Allow-Origin": "*",
      Authorization: `${productionEnv.token}`,
    },
  });
  if (response && response.status === 200) {
    return response.arrayBuffer();
  }
  return;
};

export const exportData = async (url: string, fileName = "phongdb") => {
  const data = await fetchArrayBufferData(url);
  if (!data) return;
  const u8Data = encodeHandler(data);
  if (u8Data) downloadEnData(u8Data, fileName);
};

export const getBlobLink = async (url: string) => {
  const data = await fetchArrayBufferData(url);
  if (!data) return;
  const u8Data = decodeHandler(data);

  if (u8Data) {
    const blob = new Blob([u8Data]); //cv to blob
    const blobUrl = URL.createObjectURL(blob);
    // console.log({blobUrl})
    return blobUrl;
  }
};

export const getBlobLinkV2 = (data: ArrayBuffer) => {
  if (!data) return;
  const u8Data = decodeHandler(data);

  if (u8Data) {
    // console.log(u8Data.toString()); // example
    const blob = new Blob([u8Data]); //cv to blob
    const blobUrl = URL.createObjectURL(blob); //.createObjectURL(blob);
    // console.log({blobUrl})
    return blobUrl;
  }
};

export const getTextDataAfterDecryto = (data: ArrayBuffer) => {
  if (!data) return;
  const u8Data = decodeHandler(data);

  if (!u8Data) return;
  return u8Data.toString("utf8");
  // return u8Data;
};

export const getBlobLinkV3 = (data: ArrayBuffer) => {
  try {
    const byteArrayData = new Uint8Array(data); //cv: unit 4byte->1byte -> to dec
    const bufferU8Data = Buffer.from(byteArrayData);
    const decU8BufData = decrypt(bufferU8Data, "ciquan");
    const array = new Uint8Array(decU8BufData.buffer);
    // const array = decU8BufData.buffer;
    const b = new Blob([array], { type: "application/octet-stream" });
    const url = URL.createObjectURL(b);
    console.log("urlObj:::", url);
    return url;
  } catch (error) {
    console.error("[Error] Loi giai ma Data", error);
    return;
  }
};

export const exeTask = async (url: string) => {
  return await fetch(url).then((response) => response.arrayBuffer());
};

export const executeAllTasks = async (taskUrls: any[]) => {
  return await Promise.all(taskUrls.map(exeTask));
};

export function _base64ToArrayBuffer(base64: string) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * func: encodeHandler
 * @param arrBuffData
 * @returns
 */
export const encodeHandler = (arrBuffData: ArrayBuffer): Buffer | undefined => {
  try {
    const byteArrayData = new Uint8Array(arrBuffData); //cv: unit 4byte->1byte
    const bufferU8Data = Buffer.from(byteArrayData);
    const enU8Data = encrypt(bufferU8Data, "ciquan");
    return enU8Data;
  } catch (error) {
    console.error("[Error] Loi ma hoa Data", error);
    return;
  }
};

/**
 * func: decodeHandler
 * @param file
 * @param link
 * @returns
 */
export const decodeHandler = (arrBuffData: ArrayBuffer): Buffer | undefined => {
  try {
    const byteArrayData = new Uint8Array(arrBuffData); //cv: unit 4byte->1byte -> to dec
    const bufferU8Data = Buffer.from(byteArrayData);
    const decU8BufData = decrypt(bufferU8Data, "ciquan");

    return decU8BufData;
  } catch (error) {
    console.error("[Error] Loi giai ma Data", error);
    return;
  }
};

/**
 * unusable
 * @param file
 * @param cb
 */
export function getBase64(file: any, cb: any) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.error("Error: ", error);
  };
}

/**
 * unusable
 */

// SPDX-License-Identifier: MPL-2.0

// AES Encryption/Decryption with AES-256-GCM using random Initialization Vector + Salt
// ----------------------------------------------------------------------------------------
// the encrypted datablock is base64 encoded for easy data exchange.
// if you have the option to store data binary save consider to remove the encoding to reduce storage size
// ----------------------------------------------------------------------------------------
// format of encrypted data - used by this example. not an official format
//
// +--------------------+-----------------------+----------------+----------------+
// | SALT               | Initialization Vector | Auth Tag       | Payload        |
// | Used to derive key | AES GCM XOR Init      | Data Integrity | Encrypted Data |
// | 64 Bytes, random   | 16 Bytes, random      | 16 Bytes       | (N-96) Bytes   |
// +--------------------+-----------------------+----------------+----------------+
//
// ----------------------------------------------------------------------------------------
// Input/Output Vars
//
// MASTERKEY: the key used for encryption/decryption.
//            it has to be cryptographic safe - this means randomBytes or derived by pbkdf2 (for example)
// TEXT:      data (utf8 string) which should be encoded. modify the code to use Buffer for binary data!
// ENCDATA:   encrypted data as base64 string (format mentioned on top)

// encrypt/decrypt functions

/**
 * Encrypts text by given key
 * @param String text to encrypt
 * @param Buffer masterkey
 * @returns String encrypted text, base64 encoded
 */
export function _encrypt(text: string, masterkey: Buffer) {
  // random initialization vector
  const iv = _crypto.randomBytes(16);

  // random salt
  const salt = _crypto.randomBytes(64);

  // derive encryption key: 32 byte key length
  // in assumption the masterkey is a cryptographic and NOT a password there is no need for
  // a large number of iterations. It may can replaced by HKDF
  // the value of 2145 is randomly chosen!
  const key = _crypto.pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");

  // AES 256 GCM Mode
  const cipher = _crypto.createCipheriv("aes-256-gcm", key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  // generate output
  return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
}

/**
 * Decrypts text by given key
 * @param String base64 encoded input data
 * @param Buffer masterkey
 * @returns String decrypted (original) text
 */
export function _decrypt(encdata: string, masterkey: Buffer) {
  // base64 decoding
  const bData = Buffer.from(encdata, "base64");

  // convert data to buffers
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);

  // derive key using; 32 byte key length
  const key = _crypto.pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");

  // AES 256 GCM Mode
  const decipher = _crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted =
    decipher.update(text.toString(), "binary", "utf8") + decipher.final("utf8");

  return decrypted;
}

const key = _crypto.randomBytes(32);
const iv = _crypto.randomBytes(16);
