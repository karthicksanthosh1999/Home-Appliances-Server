import userController from "../controllers/userController";
import { Router } from 'express';
import { authMiddleware } from "../controllers/authenticationController";
import upload from "../config/multer-config";

const userRouter = Router();

userRouter.post('/create-User', authMiddleware, upload.single('profile'), userController.createUser);
userRouter.get('/getAll-users', authMiddleware, userController.getAllUser);
userRouter.get('/single-user/:id', authMiddleware, userController.getSingleUser);
userRouter.delete('/delete-user/:id', authMiddleware, userController.deleteUser);
userRouter.put('/update-user/:id', authMiddleware, upload.single('profile'), userController.updateUser)
userRouter.get('/search-users', authMiddleware, userController.searchUser)
userRouter.delete('/multipleDelete-users', authMiddleware, userController.multipleDelete)


export default userRouter;