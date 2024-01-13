import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import uploads from "./uploads";
import signup from "./access/signup";
import login from "./access/login";
import logout from "./access/logout";
import token from "./access/token";
import credential from "./access/credential";
import clinic from "./clinic";
import doctor from "./doctor";
import patient from "./patient";
import profile from "./profile";
import upload from "./upload";
import ortho from "./ortho";

const router = express.Router();

router.get<unknown, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});
router.use("/uploads", uploads);
router.use("/emojis", emojis);
router.use("/upload", upload);

router.use("/signup", signup);
router.use("/login", login);
router.use("/logout", logout);
router.use("/token", token);
router.use("/credential", credential);
router.use("/profile", profile);

//clinic
router.use("/clinic", clinic);

// doctor
router.use("/doctor", doctor);

// patient
router.use("/patient", patient);

// othor
router.use("/ortho", ortho);

export default router;
