import express from "express";
import { logout, signup, singin } from "../controllers/user.contrller.js";
const router=express.Router();


router.post("/signup",signup);
router.post("/singin",singin);
router.get("/logout",logout);


export default router;