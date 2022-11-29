import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  url: process.env.BD_URL,
  type: "postgres",
  synchronize: false,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
  maxQueryExecutionTime: 2000,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source inicializado!");
  })
  .catch((e) => {
    console.error("Erro na inicialização do Data Source:", e);
  });

export default AppDataSource;
