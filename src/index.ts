import express, { Express, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import _ from "lodash/fp";
import cors, { CorsOptions } from "cors";
import {
  serverInfo,
  errorTerminal,
  errorsTerminal,
} from "src/global/utils/terminalUtils";
import { database, executeMigrations } from "src/global/database";
import router from "./router";

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env["PORT"];
const corsWhiteList: string | undefined = process.env["CORS_WHITELIST"];
const corsOptions: CorsOptions = { origin: corsWhiteList };

_.isNil(corsWhiteList) || corsWhiteList === ""
  ? errorTerminal(
      "[server-error] CORS_WHITELIST environment variable is either missing or empty."
    )
  : serverInfo(
      `[server] Cross-Origin Resource Sharing whitelist: ${corsWhiteList}`
    );

database().then(executeMigrations).catch(errorsTerminal);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((cors as (options: CorsOptions) => RequestHandler)(corsOptions));
app.use(router);

_.isNil(port) || port === ""
  ? errorTerminal(
      "[server-error] PORT environment variable is either missing or empty."
    )
  : app.listen(port, (): void => {
      serverInfo(`[server] Server is running at http://localhost:${port}`);
    });

app.get("/", (_req: Request, res: Response): void => {
  res.send("Alive and running !");
});
