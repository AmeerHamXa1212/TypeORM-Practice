import { User } from "../entities/user";
import express from "express";
import { Request, Response } from "express"; // Import Request and Response types from Express
import "reflect-metadata";
import { AppDataSource } from "../app";
import Joi from "joi";

const app = express();
app.use(express.json());
const Port = process.env.PORT || 3001;

const ValidateUser = Joi.object({
  name: Joi.string().required(),
});

export const GetAllUsers = async function (req: Request, res: Response) {
  const UserRepo = AppDataSource.getRepository(User);
  const AllUsers = await UserRepo.find();
  if (AllUsers.length === 0 || !AllUsers) {
    return res.status(404).json("No Users Found/Exists");
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
  if (userId < 1) {
    return res.status(400).json("Bad Request");
  }

  const UserRepo = AppDataSource.getRepository(User);

  const FoundUser = await UserRepo.findOne({ where: { id: userId } });
  if (!FoundUser) {
    return res.status(404).json("User Not found");
  }
  return res.status(200).json(FoundUser);
};
