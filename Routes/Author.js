import express from "express";
import AuthorController from "../Controllers/Author.js";
import { upload } from "../Middlewares/Multer.js";

const authorRoute =express.Router();
authorRoute.post('/create', upload.single("profileImageUrl"),AuthorController.createAuthor)

export default authorRoute