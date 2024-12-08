import express from "express";
import BookController from "../Controllers/Book.js";
import { upload } from "../Middlewares/Multer.js";

const router =express.Router();

router.post('/create',upload.single('coverImageUrl'), BookController.createBook)

export default router;