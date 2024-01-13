import express from "express";
import Logger from "../core/logger";

const router = express.Router();

type EmojiResponse = string[];

router.get<unknown, EmojiResponse>("/", (_req, res) => {
  res.json(["😀", "😳", "🙄"]);
});

export default router;
