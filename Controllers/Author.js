import AuthorService from "../Services/Author.js";

class AuthorController {
    async createAuthor(req, res){
        try {
            const authorData = req.body;
            const image = req.file?req.file.path :null
            if(!image){
                return res.status(400).json({ message: "profile image is required!" });
            }
            const createAuthor = await AuthorService.createAuthor(authorData, image);
            res.status(201).json(createAuthor);

        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getAuthorById(req, res){
        try {
            const {id} = req.params;
            const author = await AuthorService.fetchAuthor(id);
            return res.status(200).json({
                message:"author fetched successfully",
                data:author
            })
        } catch (error) {
            return res.status(404).json({
                message: "author not found",
                error: error.message
            })
        }
    }
    async deleteAuthorById(req, res){
        try {
            const { id } = req.params;
            const deletedAuthor = await AuthorService.deleteAuthor(id);
            if(!deletedAuthor){
                return res.status(404).json("author not found")

            }
            return res.status(200).json("author deleted successfully")
        } catch (error) {
            res.status(500).json({error:"failed deleting author",details:error.message})
        }
    }
    async updateAuthor(req, res){
        try {
            const {id} = req.params;
            const updates = req.body;
            if(req.file){
                updates.profileImageUrl = req.file.path;
            }
            const updatedData = await AuthorService.updateAuthor(id, updates)
            if (!updatedData) {
                return res.status(404).json({ error: "author not found" });
              }
              res.status(200).json({
                message: "author updated successfully",
                data: updatedData,
              });
        } catch (error) {
            res.status(500).json({
                error: "Failed to update author",
                details: error.message,
              });
        }
    }
    async getAuthorByIdWeb(req, res){
        try {
            const { id } = req.params;
            const { language } = req.query;
            const authorDetails = await AuthorService.getAuthorById(id, language)
            return res.status(200).json({
                message: "author details fetched successfully",
                data: authorDetails,
              });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch author details",
                error: error.message,
              });
        }
    }
}

export default new AuthorController();