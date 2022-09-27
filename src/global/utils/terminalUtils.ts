import { red, cyan, green, bold } from "colorette";

export const serverInfo = (message: string): void =>
  console.log(bold(green(message)));

export const databaseInfo = (message: string): void =>
  console.log(cyan(message));

export const errorTerminal = (message: string): void =>
  console.log(red(message));

export const errorsTerminal = (messages: string[]) =>
  messages.map((m: string) => errorTerminal(m));
