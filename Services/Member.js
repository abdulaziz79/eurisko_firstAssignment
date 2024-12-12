import Member from "../Models/Member.js";
import Book from "../Models/Book.js";
import Author from "../Models/Author.js"

class MemberService{
    async createMember(memberData){
        try {
            const newMember = await Member.create(memberData);
            return newMember;
        } catch (error) {
            throw new Error(`Error creating member ${error.message}`)
        }
    }
    async fetchMembers(page=1, limit=10){
        try {
            const pageNumber = parseInt(page)
            const pageSize =parseInt(limit)
            const members = await Member.find({},{birthDate: 0 }).sort({createdAt:-1, returnRate:1}).skip((pageNumber - 1)* pageSize).limit(pageSize)
            const totalMembers = await Member.countDocuments();
            return {members, totalMembers}
            
        } catch (error) {
            throw new Error(`Error fetching books: ${error.message}`);

        }
    }
    async deleteAuthor(id){
        try {
            const member = await Member.findByIdAndDelete(id);
            if(!member){
                throw new Error("Member not found")
            }
            return member
        } catch (error) {
            throw new Error(`Error deleting member${error.message}`)
        }
    }
    async updateMember(id, updates){
        try {
            const updated = await Member.findByIdAndUpdate(id, {$set:updates}, {new: true})
            return updated;
        } catch (error) {
            throw new Error(`Error updating member: ${error.message}`)
        }
    }
    async borrowBook(memberId, bookId) {
        try {
            const member = await Member.findById(memberId);
            const book = await Book.findById(bookId).populate("authorId");
    
            if (!member) throw new Error("Member not found");
            if (!book) throw new Error("Book not found");
    
            if (!book.authorId || !book.authorId.email) {
                throw new Error("Author's email not found");
            }
    
            if (member.returnRate < 30) {
                throw new Error("Member's return rate is below 30%, borrowing not allowed.");
            }
    
            const memberAge = new Date().getFullYear() - new Date(member.birthDate).getFullYear();
            if (memberAge < book.minAge) {
                throw new Error(`Member is under the required age of ${book.minAge}`);
            }
    
            if (book.numberOfAvailableCopies <= 0) {
                throw new Error("No copies available to borrow.");
            }
    
            member.borrowedBooks.push({
                borrowedBookId: book._id,
                borrowedDate: new Date(),
                returnDate: new Date(Date.now() + book.numberOfBorrowableDays * 24 * 60 * 60 * 1000),
            });
            book.numberOfAvailableCopies -= 1;
            await member.save();
            await book.save();
    
            return { member, book };
        } catch (error) {
            throw new Error(`Error borrowing book: ${error.message}`);
        }
    }
    
    async getBorrowedBook(memberId){
        try {
            const member = await Member.findById(memberId).select("borrowedBooks")
            if (!member) throw new Error("Member not found");

            const currentDate = new Date()

            const borrowedBooks = member.borrowedBooks.map(book =>{
            const returnDate = new Date(book.returnDate);
            const timeDiff = returnDate - currentDate; 
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
            const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60)); 

            return {
                borrowedBookId: book.borrowedBookId,
                daysLeft,
                flags: {
                    warning: hoursLeft > 0 && hoursLeft < 12,
                    expired: hoursLeft <= 0,
                },
            };
            })
            borrowedBooks.sort((a, b) => a.daysLeft - b.daysLeft);
            return borrowedBooks
        } catch (error) {
            throw new Error(`Error fetching borrowed books: ${error.message}`);
        }
    }
    async subscribeAndUnsubscrube(memberId, bookId) {
        try {
          const member = await Member.findById(memberId);
          const book = await Book.findById(bookId);
      
          if (!member) throw new Error("Member not found");
          if (!book) throw new Error("Bookkk not found");
      
          const index = member.subscribedBooks.indexOf(bookId);
          if (index !== -1) {

            member.subscribedBooks.splice(index, 1);
            await member.save();
            return { message: "Unsubscribed from book successfully" };
          } else {

            member.subscribedBooks.push(bookId);
            await member.save();
            return { message: "Subscribed to book successfully" };
          }
        } catch (error) {
          throw new Error(`Error subscribing/unsubscribing to book: ${error.message}`);
        }
      }
      async returnBook(memberId, bookId) {
        try {
            const member = await Member.findById(memberId);
            const book = await Book.findById(bookId);
    
            if (!member) throw new Error("Member not found");
            if (!book) throw new Error("Book not found");
    
            const borrowedBook = member.borrowedBooks.find(
                (b) => b.borrowedBookId.toString() === bookId
            );
    
            // if (!borrowedBook) throw new Error("Book not found in member's borrowed list");
    
            const returnDate = new Date(borrowedBook.returnDate);
            const currentDate = new Date();
    
            if (currentDate <= returnDate) {
                member.returnRate = Math.min(member.returnRate + 10, 100); 
            } else {
                member.returnRate = Math.max(member.returnRate - 10, 0); 
            }
    
            member.borrowedBooks = member.borrowedBooks.filter(
                (b) => b.borrowedBookId.toString() !== bookId
            );
    
            book.numberOfAvailableCopies += 1;
    
            await member.save();
            await book.save();
    
            return { member, book };
        } catch (error) {
            throw new Error(`Error returning book: ${error.message}`);
        }
    }
    
}

export default new MemberService()