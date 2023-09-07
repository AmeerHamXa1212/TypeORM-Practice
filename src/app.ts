import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";

const app = express();

app.use(express.json());

const PORT = 8000;

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432, // should be in .env file
  username: "postgres", // should be in .env file
  password: "postgres", // should be in .env file
  database: "typeorm_db", // should be in .env file
  entities: ["src/entities/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Running");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", function (req, res) {
  res.send("Hello");
});
