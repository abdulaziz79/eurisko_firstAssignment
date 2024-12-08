import BookService from "../Services/Book.js";

class BookController {
    async createBook(req, res){
        try {
            const bookData = req.body;
            const coverImage = req.file?req.file.path :null
            if(!coverImage){
                return res.status(400).json({ message: "Cover image is required!" });
            }
            const createBook = await BookService.createBook(bookData, coverImage);
            res.status(201).json(createBook);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

export default new BookController();