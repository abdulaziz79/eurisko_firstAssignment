import MemberService from "../Services/Member.js"

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
}
export default new MemberController()