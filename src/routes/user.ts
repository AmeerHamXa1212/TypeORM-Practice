import { Router } from "express";
import { GetAllUsers, CreateUser, FindUserByID } from "../controllers/user";

const UserRouter = Router();

UserRouter.get("/user", GetAllUsers);
UserRouter.post("/newuser", CreateUser);
UserRouter.get("/users/:id", FindUserByID);

export default UserRouter;
