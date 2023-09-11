import { User } from "../entities/user";
import express from "express";
import { Request, Response } from "express"; // Import Request and Response types from Express
import "reflect-metadata";
import { AppDataSource } from "../app";
import Joi from "joi";
import { checkAndReturnIfEmpty } from "../utility/nullcheck";

const app = express();
app.use(express.json());
const Port = process.env.PORT || 3001;

const ValidateUser = Joi.object({
  name: Joi.string().required(),
});

export const GetAllUsers = async function (req: Request, res: Response) {
  const UserRepo = AppDataSource.getRepository(User);
  const AllUsers = await UserRepo.find();
  if (checkAndReturnIfEmpty(AllUsers, res, "No Users Found/Exists")) {
    return;
  }
  return res.status(200).json(AllUsers);
};
export const CreateUser = async function (req: Request, res: Response) {
  const UserRepo = AppDataSource.getRepository(User);
  const { error, value } = ValidateUser.validate(req.body);
  if (error) {
    return res.status(400).json(`Bad Request : ${error}`);
  }
  const { name } = value;
  let user: User = new User();
  user.uname = name;
  const createdUser = await UserRepo.save(user);
  res.status(201).json(createdUser);
};
export const FindUserByID = async function (req: Request, res: Response) {
  const userId: number = parseInt(req.params.id, 10);
  if (userId < 1 || isNaN(userId)) {
    return res.status(400).json("Bad Request");
  }
  const UserRepo = AppDataSource.getRepository(User);

  const FoundUser = await UserRepo.findOne({ where: { id: userId } });
  if (checkAndReturnIfEmpty(FoundUser, res, "User Not found")) {
    return;
  }
  return res.status(200).json(FoundUser);
};
