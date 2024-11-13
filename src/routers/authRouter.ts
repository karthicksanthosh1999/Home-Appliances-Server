import express from "express";
import { authMiddleware, Logout, SignIn, tokenDecoder, verifyEmail, verifyEmailSend, welcome } from "../controllers/authenticationController";

const authRouter = express.Router();

authRouter.post("/signIn", SignIn);
authRouter.get("/logout", Logout);
authRouter.get('/', authMiddleware, welcome)
authRouter.get('/decode', authMiddleware, tokenDecoder)
authRouter.post('/verifyEmailSend/:userId', authMiddleware, verifyEmailSend)
authRouter.get('/verifyEmail', verifyEmail)

export default authRouter;