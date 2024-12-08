import AuthorService from "../Services/Author.js";

class AuthorController {
    async createAuthor(req, res){
        try {
            const authorData = req.body;
            const image = req.file && req.path
            if(!image){
                return res.status(400).json({ message: "Cover image is required!" });
            }
            const createAuthor = await AuthorService.createAuthor(authorData, image);
            res.status(201).json(createAuthor);

        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

export default new AuthorController();