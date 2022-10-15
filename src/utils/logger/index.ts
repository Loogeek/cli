import chalk from 'chalk';

const log = console.log;

export const info = (msg: string) => {
  log(chalk.cyan(`\n${msg}\n`));
};

export const error = (msg: string) => {
  log(chalk.bgRed(`\n${msg}\n`));
};

export const warn = (msg: string) => {
  log(chalk.yellow(`\n${msg}\n`));
};
