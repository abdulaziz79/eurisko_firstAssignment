import Book from "../Models/Author.js";

class AuthorService {
    async createAuthor(authorData, image){
        try {
            const book = {
                ...authorData,
                profileImageUrl:image

            }
            const newAuthor = await Book.create(book);
            return newAuthor;
        } catch (error) {
            throw new Error(`Error creating book ${error.message}`)
        }
    }
}

export default new AuthorService()