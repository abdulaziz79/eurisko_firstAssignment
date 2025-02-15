import BookService from "../Services/Book.js";
import sendEmail from "../email/Email.js";
import Member from "../Models/Member.js";

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
    async getAllBooks(req,res){
        try {
            const {page = 1, limit = 10} = req.query;
            const {books , totalBooks} = await BookService.fetchBooks(page, limit)
            return res.status(200).json({
                message: "Books fetched successfully",
                data: {
                  books,
                  pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalBooks / limit),
                    totalBooks,
                  },
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch books",
                error: error.message,
              });
        }
    }
    async getBookById(req, res){
        try {
            const {id} = req.params;
            const book = await BookService.fetchBookById(id);
            return res.status(200).json({
                message: "Book fetched successfully",
                data: book,
              });
        } catch (error) {
            return res.status(404).json({
                message: "Book not found",
                error: error.message
            })
        }
    }
    async updateBook(req, res){
        try {
            const {id} = req.params;
            const updates = req.body;
            const findById = await BookService.fetchBookById(id);
            if (findById.isPublished) {
                return res.status(400).json({ message: "Cannot update a published book" });
            }
            if (Object.prototype.hasOwnProperty.call(updates, "isPublished")) {
                delete updates.isPublished;
            }
            
              if(req.file){
                updates.coverImageUrl = req.file.path;
              }
              const updatedData = await BookService.updateBook(id, updates)
              if (!updatedData) {
                return res.status(404).json({ error: "Book not found" });
              }
             
        
              res.status(200).json({
                message: "Book updated successfully",
                data: updatedData,
              });
        } catch (error) {
            res.status(500).json({
                error: "Failed to update book",
                details: error.message,
              });
        }
    }
    async deleteBookById(req, res){
        try {
            const {id} = req.params;
            const findBook = await BookService.fetchBookById(id)
            if (findBook.isPublished) {
                return res.status(400).json({ message: "Cannot delete a published book" });
            }
            const book = await BookService.deleteBook(id);
            if(!book){
                return res.status(404).json("book not found")
            }
    
            res.status(200).json("book deleted successfully")
        } catch (error) {
            res.status(500).json({error:"failed deleting book",details:error.message})
        }
    }
    async togglePublish(req, res){
        try {
            const {id} = req.params;
            const book = await BookService.fetchBookById(id)

            if (!book) {
                return res.status(404).json({ error: "Book not found" });
              }
              const updatedBook = await BookService.updateBook(id, {
                isPublished:!book.isPublished
              })

              const status = updatedBook.isPublished ?"published" :"unpublished";

              if(updatedBook.isPublished){
                const subscribedMembers = await Member.find({subscribedBooks: id});
                for(const member of subscribedMembers){
                    const subject = `New Book Published: ${updatedBook.title}`;
                    const text = `Dear ${member.name},\n\nThe book "${updatedBook.title}" has just been published. Check it out now!`;
                    const html = `<p>Dear ${member.name},</p><p>The book "<strong>${updatedBook.title}</strong>" has just been published. Check it out now!</p>`;
                    try {
                        await sendEmail(member.email,subject, text, html)
                    } catch (error) {
                        console.error(`Failed to send email to ${member.email}:`, emailError.message);
                    }
                }
              }
              res.status(200).json({
                message: `Book ${status} successfully`,
                data: updatedBook,
              });

        } catch (error) {
            res.status(500).json({
                error: "Failed to toggle publish status",
                details: error.message,
              });
        }
    }

    async getPublishedBooks(req, res){
        try {
            const {page, limit, genre, language} = req.query;
            const {books, totalBooks} = await BookService.fetchPublishBooks({page, limit, genre, language})

            return res.status(200).json({
                message: "Published books fetched successfully",
                data: {
                    books,
                    pagination: {
                        currentPage: parseInt(page) || 1,
                        totalPages: Math.ceil(totalBooks / (parseInt(limit) || 10)),
                        totalBooks,
                    },
                },
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch published books",
                error: error.message,
            });
        }
        
    }
    async getBookByIdWeb(req, res){
        try {
            const {bookId} = req.params;
            const {language} = req.query;

            const bookDetails = await BookService.getBookById({bookId, language});

            return res.status(200).json({
                message: "Book details fetched successfully",
                data: bookDetails,
              });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch book details",
                error: error.message,
              });
        }
    }
}

export default new BookController();