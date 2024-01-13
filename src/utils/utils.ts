export const splitNumberFromString = (text: string) => text.match(/\d+/g);

export const angleToRadians = (angleInDeg: number) =>
  (Math.PI / 180) * angleInDeg;

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const getTwoLatestItemFromPathString = (pathString: string) => {
  const pieces = pathString.split("/");
  if (!!pieces && pieces.length < 2) return;
  const last = pieces[pieces.length - 2] + "/" + pieces[pieces.length - 1];
  return last;
};

/**
 * desc: get size string
 * @param (string) str
 * @returns (number) size
 */
export const len = (str: string) => {
  const size = Buffer.from(str).length;
  return size;
};
