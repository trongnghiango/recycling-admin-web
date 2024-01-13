// pages/api/readfiles.js
import fs from "fs";
import path from "path";
import getConfig from "next/config";
import { NextApiRequest, NextApiResponse } from "next";
interface NextCustomApiRequest extends NextApiRequest {
  userId: string;
}

export default (req: NextCustomApiRequest, res: NextApiResponse) => {
  const { serverRuntimeConfig } = getConfig();
  const { query } = req;

  console.log("userId::", req["query"].userId);
  const userId = (query.userId ?? "").toString();

  const dir = path.join(serverRuntimeConfig.PROJECT_ROOT, "./uploads", userId);

  const filenames = fs.readdirSync(dir);

  res.statusCode = 200;
  res.json({ data: filenames });
};
