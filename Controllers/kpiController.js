import Book from "../Models/Book.js";
import Member from "../Models/Member.js";

export const calculateBooksPublishRate = async (req, res)=>{
    try {
        const totalBooks = await Book.countDocuments()
        const publishedBooks = await Book.countDocuments({isPublished:true})

        if(totalBooks === 0 ) return res.status(200).json({publishRate: 0})

        const publishRate = (publishedBooks/totalBooks)*100;
            return res.status(200).json({publishRate})
    } catch (error) {
        return res.status(500).json({ message: "Error calculating Books Publish Rate", error });
    }
}

export const calculateAverageMemberReturnRate = async (req, res)=>{
    try {
        const members = await Member.find();
        let totalBorrowedBooks = 0;
        let totalReturnOnTime = 0;

        members.forEach(member=>{
            member.borrowedBooks.forEach(book=>{
                totalBorrowedBooks++;
                const returnDate = new Date(book.returnDate);
                const currentDate = new Date();
                if(returnDate >= currentDate){
                    totalReturnOnTime++
                }
            })
        })
        if(totalBorrowedBooks ===0 ) return res.status(200).json({returnRate : 0});

        const returnRate = (totalReturnOnTime/totalBorrowedBooks)*100;
        return res.status(200).json({ returnRate });

    } catch (error) {
        return res.status(500).json({ message: "Error calculating Average Members Return Rate", error });
    }
}