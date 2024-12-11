import Member from "../Models/Member.js";

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
            const members = await Member.find({},{birthDate: 0, subscribedBooks: 0 }).sort({createdAt:-1, returnRate:1}).skip((pageNumber - 1)* pageSize).limit(pageSize)
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
            const updates = await Member.findByIdAndUpdate(id, {$set:updates}, {new: true})
            return updates;
        } catch (error) {
            throw new Error(`Error updating member: ${error.message}`)
        }
    }
}

export default new MemberService()