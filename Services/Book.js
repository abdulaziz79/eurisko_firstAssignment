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

    async fetchPublishBooks({page =1, limit = 10, genre, language}){
        try {
            const pageNumber = parseInt(page);
            const pageSize = parseInt(limit);

            const filters = {isPublished : true}
            if (genre) filters.genre = genre;
            const projection = {
                genre: 1,
                coverImageUrl: 1,
                isBorrowable: 1,
              };
              const selectLanguage = language || "en"
                projection[`title.${selectLanguage}`] = 1;
                projection[`description.${selectLanguage}`] = 1;
              
              const books = await Book.find(filters, projection)
              .sort({ numberOfAvailableCopies: -1 })
              .skip((pageNumber - 1) * pageSize)
              .limit(pageSize);
      
    
                const totalBooks = await Book.countDocuments(filters);

                return{books, totalBooks};
        } catch (error) {
            throw new Error(`error fetching published Books ${error.message}`)
        }
    }

    async getBookById({bookId, language}){
        try {
            const book = await Book.findById(bookId);
            if (!book) {
                throw new Error("Book not found");
              }
              const selectedLanguage = language || "en";

              const projection = {
                genre: 1,
                ISBN: 1,
                numberOfAvailableCopies: 1,
                borrowDuration: 1,
                isOpenToReview: 1,
                authorId: 1,
                publishedDate: 1,
                [`title.${selectedLanguage}`]: 1,
                [`description.${selectedLanguage}`]: 1,
              };

              const bookDetails = await Book.findById(bookId, projection);
              return bookDetails;
        } catch (error) {
            throw new Error(`Error fetching book by ID: ${error.message}`);
        }
    }

}

export default new BookService()