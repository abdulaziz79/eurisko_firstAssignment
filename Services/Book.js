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
    async fetchBooks(page=1, limit=10){
        try {
            const pageNumber = parseInt(page)
            const pageSize =parseInt(limit)

            const books = await Book.find({},{createdAt: 0, updatedAt: 0 }).sort({createdAt:-1, authorId:1}).skip((pageNumber - 1)* pageSize).limit(pageSize)

            const totalBooks = await Book.countDocuments();
            return {books, totalBooks}
        } catch (error) {
            throw new Error(`Error fetching books: ${error.message}`);
        }
    }
    async fetchBookById(id){
        try {
            const book = await Book.findById(id).populate('authorId');
            if(!book){
                throw new Error("book not found")
            }
            return book
        } catch (error) {
            throw new Error(`Error fetching book: ${error.message}`);
        }
    }
    async updateBook(id, updates){
        try {
            const updatedBook = await Book.findByIdAndUpdate(id, {$set:updates}, {new:true})
            return updatedBook
        } catch (error) {
            throw new Error(`Error updating book: ${error.message}`)
        }
    }
    async deleteBook(id){
        try {
            const deletedBook = await Book.findByIdAndDelete(id);
            return deletedBook
        } catch (error) {
            throw new Error(`error deleting book: ${error.message}`)
        }
    }

}

export default new BookService()