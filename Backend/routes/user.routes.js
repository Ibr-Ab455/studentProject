import express from "express";
import { registerUser, signinUser } from "../controller/user.controller.js";


const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", signinUser);


export default router;