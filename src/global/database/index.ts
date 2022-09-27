import dotenv from "dotenv";
import {
  FileMigrationProvider,
  Kysely,
  MigrationResultSet,
  Migrator,
  MysqlDialect,
} from "kysely";
import { createPool } from "mysql2";
import { promises as fs } from "fs";
import path from "path";
import _ from "lodash";
import { databaseInfo, errorTerminal } from "src/global/utils/terminalUtils";
import type { ExampleTable } from "./tables";

dotenv.config();

const dbHost: string | undefined = process.env["DB_HOST"];
const dbSchema: string | undefined = process.env["DB_SCHEMA"];
const dbUser: string | undefined = process.env["DB_USER"];
const dbPassword: string | undefined = process.env["DB_PASSWORD"];

interface Database {
  equipments: ExampleTable;
}

interface DatabaseEnvVars {
  DB_HOST: string | undefined;
  DB_SCHEMA: string | undefined;
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
}

const databaseEnvVars: DatabaseEnvVars = {
  DB_HOST: dbHost,
  DB_SCHEMA: dbSchema,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
};

const missingDatabaseEnvErrorMessages = (
  envVars: DatabaseEnvVars = databaseEnvVars
): string[] => {
  const errorMessages: string[] = [];
  _.forEach(envVars, (value: string | undefined, key: string): void => {
    if (_.isNil(value) || value === "")
      errorMessages.push(
        `[database-error] ${key} environment variable is either missing or empty.`
      );
  });
  return errorMessages;
};

export const database = (): Promise<Kysely<Database>> => {
  if (
    !_.isNil(dbHost) &&
    dbHost !== "" &&
    !_.isNil(dbSchema) &&
    dbSchema !== "" &&
    !_.isNil(dbUser) &&
    dbUser !== "" &&
    !_.isNil(dbPassword) &&
    dbPassword !== ""
  )
    return Promise.resolve(
      new Kysely<Database>({
        dialect: new MysqlDialect({
          pool: createPool({
            host: dbHost,
            database: dbSchema,
            user: dbUser,
            password: dbPassword,
          }),
        }),
      })
    );

  return Promise.reject(missingDatabaseEnvErrorMessages());
};

const migrator = (db: Kysely<Database>): Migrator =>
  new Migrator({
    db: db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../../../migrations"),
    }),
  });

export const executeMigrations = (db: Kysely<Database>): Promise<void> =>
  migrator(db)
    .migrateToLatest()
    .then((migrationResultSet: MigrationResultSet) =>
      migrationResultSet.error
        ? errorTerminal(
            `[database-error] ${migrationResultSet.error as string}`
          )
        : databaseInfo("[database] Migrations ran properly.")
    )
    .catch(() =>
      errorTerminal(
        "[database-error] Something went wrong while running migrations."
      )
    );
