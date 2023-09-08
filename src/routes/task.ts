import { Router } from "express";
import {
  GetAllTask,
  GetTaskByID,
  GetTaskForUser,
  CreateTask,
  DeleteTask,
} from "../controllers/task";

const TaskRouter = Router();

TaskRouter.get("/task", GetAllTask);
TaskRouter.get("/task/:id", GetTaskByID);
TaskRouter.get("/tasks/:uid", GetTaskForUser);
TaskRouter.post("/task", CreateTask);
TaskRouter.delete("/taskd/:id", DeleteTask);

export default TaskRouter;
