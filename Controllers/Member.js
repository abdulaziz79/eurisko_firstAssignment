import MemberService from "../Services/Member.js"
import sendEmail from "../email/Email.js";

class MemberController {
    async createMember(req, res){
        try {
            const memberDataa = req.body;
            const createMemberr = await MemberService.createMember(memberDataa);
            res.status(201).json(createMemberr);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getAllMembers(req, res){
        try {
            const {page = 1, limit = 10} = req.query;
            const {members, totalMembers} = await MemberService.fetchMembers(page, limit);
            return res.status(200).json({
                message: "Members fetched successfully",
                data: {
                  members,
                  pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalMembers / limit),
                    totalMembers,
                  },
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch members",
                error: error.message,
              });
        }
    }
    async deleteMember(req, res){
        try {
            const {id} = req.params;
            const deletedMember = await MemberService.deleteAuthor(id);
            if(!deletedMember){
                return res.status(404).json("member not found")
            }
            return res.status(200).json("member deleted successfully")
        } catch (error) {
            res.status(500).json({error:"failed deleting member",details:error.message})
        }
    }
    async updateMember(req, res){
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedMember = await MemberService.updateMember(id, updates);
            if (!updatedMember) {
                return res.status(404).json({ error: "member not found" });
              }
              res.status(200).json({
                message: "member updated successfully",
                data: updatedMember,
              });
        } catch (error) {
            res.status(500).json({
                error: "Failed to update member",
                details: error.message,
              });
        }
    }
    async borrowBook(req, res) {
        try {
            const { memberId, bookId } = req.body;
    
            const { member, book } = await MemberService.borrowBook(memberId, bookId);
    
            if (book.authorId && book.authorId.email) {
                const subject = `Your book has been borrowed`;
                const text = `Hi, your book "${book.title.en}" has been borrowed by ${member.name}.`;
                const html = `<p>Hi,</p><p>Your book "<strong>${book.title.en}</strong>" has been borrowed by ${member.name}.</p>`;
                
                try {
                    await sendEmail(book.authorId.email, subject, text, html);
                } catch (emailError) {
                    console.error(`Failed to send email to ${book.authorId.email}:`, emailError.message);
                }
            } else {
                console.warn("Author's email not found; skipping email notification.");
            }
    
            return res.status(200).json({
                message: "Book borrowed successfully",
                data: { member, book },
            });
        } catch (error) {
            return res.status(500).json({
                error: "Failed to borrow book",
                details: error.message,
            });
        }
    }

    async getBorrowedBooks(req, res){
        try {
            const { id } = req.params;
            const borrowedBooks = await MemberService.getBorrowedBook(id);
            return res.status(200).json({
                message: "Borrowed books retrieved successfully",
                data: borrowedBooks,
            });
        } catch (error) {
            return res.status(500).json({
                error: "Failed to fetch borrowed books",
                details: error.message,
            });
        }
    }

    async subscribeOrUnsubscribe(req, res) {
        try {
          const { memberId, bookId } = req.body;
      
          const result = await MemberService.subscribeAndUnsubscrube(memberId, bookId);
      
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
}
export default new MemberController()