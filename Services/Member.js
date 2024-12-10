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
}

export default new MemberService()