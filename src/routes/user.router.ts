import { Router } from "express";
import UserController from "../controllers/user.controller";


const UserRouter : Router = Router();

UserRouter.post('/user/signup', UserController.signup);

export default UserRouter;