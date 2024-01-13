import { Router } from "express";
import asyncHandler from "../../helpers/asyncHandler";
import path from "path";
import fs from "fs";



const router = Router()
router.get(
    "/get-by-patient",
    asyncHandler( async (req, res, next) => {

        
    const { query } = req;

    console.log("userId::", req["query"].userId);
    const userId = (query.userId ?? "").toString();

    const dir = path.join(__dirname, "../../../uploads", userId);

    const filenames = fs.readdirSync(dir);

    res.statusCode = 200;
    res.json({ data: filenames });
    }),
)

export default router;