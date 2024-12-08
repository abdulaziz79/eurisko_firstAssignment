import Book from "../Models/Book.js";

class BookService {
    async createBook(bookData, image){
        try {
            const book = {
                ...bookData,
                coverImageUrl:image

            }
            const newBook = await Book.create(book);
            return newBook;
        } catch (error) {
            throw new Error(`Error creating book ${error.message}`)
        }
    }
}

export default new BookService()