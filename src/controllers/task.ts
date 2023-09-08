import { User } from "../entities/user";
import { Tasks } from "../entities/task";
import express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "../app";
import Joi from "joi";
import { checkAndReturnIfEmpty } from "../utility/nullcheck";

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

  //   checkNullAndEmpty(AllTask,"No Task Found")
  if (checkAndReturnIfEmpty(AllTask, res, "No tasks found")) {
    return;
  }

  //   if (AllTask.length === 0 || !AllTask) {
  //     return res.status(404).json("No tasks found");
  //   }
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
  if (checkAndReturnIfEmpty(existingUser, res, "User not found")) {
    return;
  } else {
    const newTask = new Tasks();
    newTask.title = title;
    newTask.user_id = user_id;
    newTask.description = description;
    newTask.status = status;
    newTask.priority = priority;
    const CreatedTask = await TaskRepo.save(newTask);
    res.status(201).json(CreatedTask);
  }
};

export const GetTaskForUser = async function (req: Request, res: Response) {
  const UserRepo = AppDataSource.getRepository(User);
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const userid = parseInt(req.params.uid, 10);
  const existingUser = await UserRepo.findOne({ where: { id: userid } });

  if (checkAndReturnIfEmpty(existingUser, res, "User not found")) {
    return;
  }
  const UserTasks = await TaskRepo.find({
    where: { user_id: { id: userid } },
  });
  if (
    checkAndReturnIfEmpty(
      UserTasks,
      res,
      `Tasks for user with id : ${userid} do not exist`
    )
  ) {
    return;
  }
  res.status(200).json(UserTasks);
};
export const GetTaskByID = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const Taskid = parseInt(req.params.id, 10);
  const existingTask = await TaskRepo.findOne({ where: { id: Taskid } });

  if (
    checkAndReturnIfEmpty(
      existingTask,
      res,
      `task with id : ${Taskid} do not exist`
    )
  ) {
    return;
  }
  res.status(200).json(existingTask);
};

export const DeleteTask = async function (req: Request, res: Response) {
  const TaskRepo = AppDataSource.getRepository(Tasks);
  const Taskid = parseInt(req.params.id, 10);
  const existingTask = await TaskRepo.findOne({ where: { id: Taskid } });
  if (
    checkAndReturnIfEmpty(
      existingTask,
      res,
      `task with id : ${Taskid} do not exist`
    )
  ) {
    return;
  }
  await TaskRepo.delete(Taskid);
  res.status(200).json("Task deleted successfully");
};
