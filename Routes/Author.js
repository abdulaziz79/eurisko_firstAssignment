import express from "express";
import AuthorController from "../Controllers/Author.js";
import { upload } from "../Middlewares/Multer.js";

const authorRoute =express.Router();
authorRoute.post('/create', upload.single("profileImageUrl"),AuthorController.createAuthor)
authorRoute.get("/getById/:id", AuthorController.getAuthorById)
authorRoute.get("/getByIdWeb/:id", AuthorController.getAuthorByIdWeb)
authorRoute.delete("/delete/:id", AuthorController.deleteAuthorById)
authorRoute.patch('/update/:id',upload.single("profileImageUrl"), AuthorController.updateAuthor )


export default authorRoute