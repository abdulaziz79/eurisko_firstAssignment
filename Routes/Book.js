import express from "express";
import BookController from "../Controllers/Book.js";
import { upload } from "../Middlewares/Multer.js";

const router =express.Router();

router.post('/create',upload.single('coverImageUrl'), BookController.createBook)
router.get('/getAll', BookController.getAllBooks)
router.get('/getById/:id', BookController.getBookById)
router.put('/update/:id',upload.single("coverImageUrl"), BookController.updateBook)
router.patch("/:id/toggle-publish", BookController.togglePublish);




export default router;