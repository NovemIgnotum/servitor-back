import chalk from "chalk";

// This function is for see the status of the connection of the mongoDB
export default class Retour {
  public static log = (args: any) => this.info(args);
  // If is connected it is in Blue
  public static info = (args: any) =>
    console.log(
      chalk.blueBright(
        `[${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}] [INFO RESPONSE]`
      ),
      typeof args === "string" ? chalk.green(args) : args
    );
  // If is we have some trouble it is in Yellow
  public static warn = (args: any) =>
    console.log(
      chalk.yellow(
        `[${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}] [WARN RESPONSE]`
      ),
      typeof args === "string" ? chalk.yellow(args) : args
    );
  // If is not connected it is in red
  public static error = (args: any) =>
    console.log(
      chalk.red(
        `[${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}] [ERROR RESPONSE]`
      ),
      typeof args === "string" ? chalk.red(args) : args
    );

  public static success = (args: any) =>
    console.log(
      chalk.green(
        `[${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}] [SUCCESS RESPONSE]`
      ),
      typeof args === "string" ? chalk.green(args) : args
    );
}
