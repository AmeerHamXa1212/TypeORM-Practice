import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import UserRouter from "./routes/user";
import TaskRouter from "./routes/task";
dotenv.config();

const app = express();
app.use(express.json());
const Port = process.env.PORT || 3001;

app.use("/todo", UserRouter, TaskRouter);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  database: process.env.DATABASE,
  password: process.env.DATABASE_KEY,
  port: 5432,
  entities: ["src/entities/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log(`Connection to postgreSQL Database Successful`);
    app.listen(Port, () => console.info(`Server is running at Port ${Port}`));
  })
  .catch((err) => {
    console.log(err);
  });
