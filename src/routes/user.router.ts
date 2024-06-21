import { Router } from "express";
import UserController from "../controllers/user.controller";


const UserRouter : Router = Router();

UserRouter.post('/user/signup', UserController.signup);
UserRouter.post('/user/signin', UserController.signin);

export default UserRouter;