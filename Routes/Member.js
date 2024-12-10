import express from "express";
import MemberController from "../Controllers/Member.js";

const memberRoute =express.Router();
memberRoute.post('/create',MemberController.createMember)
memberRoute.get('/getMembers',MemberController.getAllMembers)


export default memberRoute