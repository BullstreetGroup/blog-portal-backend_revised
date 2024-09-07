import express from "express";
import { uploaderMiddleware,upload } from "../middleware/uploader.js"; 


const router = express.Router();

router.route('/upload').post(uploaderMiddleware, upload);

export default router;
