import { User } from "../entities/user";
import { Tasks } from "../entities/task";
import express from "express";
import { Request, Response } from "express"; // Import Request and Response types from Express
import "reflect-metadata";
import { AppDataSource } from "../app";
import Joi from "joi";

const ValidateTask = Joi.object({
  user_id: Joi.number().required(),
  title: Joi.string().max(25).required(),
  description: Joi.string().max(500).required(),
  status: Joi.string().required().valid("PENDING", "INPROGRESS", "COMPLETED"),
  priority: Joi.number().required().valid(0, 1, 2),
});

export const GetAllTask = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const AllTask = await TaskRepo.find();

  if (AllTask.length === 0 || !AllTask) {
    return res.status(404).json("No tasks found");
  }
  return res.status(200).json(AllTask);
};

export const CreateTask = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const UserRepo = AppDataSource.getRepository(User);
  const { error, value } = ValidateTask.validate(req.body);
  if (error) {
    console.log("Error : ", error);
    return res.status(400).json("Bad Request");
  }
  const { user_id, title, description, status, priority } = value;
  //check for user id existence
  const existingUser = await UserRepo.findOne({ where: { id: user_id } });
  if (!existingUser) {
    console.log("Error : User not found so no task can be created");
    return res.status(404).json(`User with id ${user_id} does not exists`);
  }

  const newTask = TaskRepo.create({
    user_id: existingUser, // Assign the existingUser object
    title,
    description,
    status,
    priority,
  });
  const CreatedTask = await TaskRepo.save(newTask);
  res.status(201).json(CreatedTask);
};
export const UpdateTask = async function (req: Request, res: Response) {};
export const GetTaskForUser = async function (req: Request, res: Response) {
  const UserRepo = AppDataSource.getRepository(User);
  const TaskRepo = AppDataSource.getRepository(Tasks);

  const userid = parseInt(req.params.uid, 10);
  const existingUser = await UserRepo.findOne({ where: { id: userid } });
  if (!existingUser) {
    console.log("Error : User not found so no task can be retrieved");
    return res.status(404).json(`User with id ${userid} does not exists`);
  }
  const UserTasks = await TaskRepo.find({
    where: { user_id: { id: userid } },
  });
  if (UserTasks.length === 0) {
    return res
      .status(404)
      .json(`Tasks for user with id : ${userid} do not exist`);
  }
  res.status(200).json(UserTasks);
};
export const GetTaskByID = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const Taskid = parseInt(req.params.id, 10);
  const existingTask = await TaskRepo.findOne({ where: { id: Taskid } });
  if (!existingTask) {
    console.log(`Error : task with id : ${Taskid} cant be retrieved`);
    return res.status(404).json(`task with id : ${Taskid} do not exist`);
  }
  res.status(200).json(existingTask);
};
export const DeleteTask = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const Taskid = parseInt(req.params.id, 10);
  const existingTask = await TaskRepo.findOne({ where: { id: Taskid } });
  if (!existingTask) {
    console.log(`Error : task with id : ${Taskid} cant be retrieved`);
    return res.status(404).json(`task with id : ${Taskid} do not exist`);
  }

  await TaskRepo.remove(existingTask);
  res.status(200).json("Task deleted successfully");
};
