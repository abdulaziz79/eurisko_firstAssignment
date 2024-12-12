import express from "express";
import MemberController from "../Controllers/Member.js";

const memberRoute =express.Router();
memberRoute.post('/create',MemberController.createMember)
memberRoute.get('/getMembers',MemberController.getAllMembers)
memberRoute.delete('/delete',MemberController.deleteMember)
memberRoute.patch('/update/:id',MemberController.updateMember)
memberRoute.post('/borrow', MemberController.borrowBook)
memberRoute.post('/subscribe-or-unsubscribe', MemberController.subscribeOrUnsubscribe);
memberRoute.get('/getBorrowedBooks/:id',MemberController.getBorrowedBooks)




export default memberRoute