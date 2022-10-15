import { program } from 'commander';
import fs from 'fs';
import { join, dirname } from 'path';
import pacote from 'pacote';
import { globby } from 'globby';
// import { fileURLToPath } from 'url';
import { error, info } from './utils/logger';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
let pkgName = '';
let pkgVersion = '';
// let commandPaths: string[] = []

const getCommand = async () => {
  const commandPaths = await globby('./commands/*.*s', {
    cwd: __dirname,
    deep: 1,
  });
  return commandPaths;
};

const getLasterVersion = async () => {
  const manifest = await pacote.manifest(`${pkgName}@laster`);

  return manifest.version;
};

const getPkgInfo = () => {
  const pkg = join(__dirname, '../package.json');
  const pkgContent = fs.readFileSync(pkg, 'utf-8');
  const pkgResult = JSON.parse(pkgContent);

  pkgName = pkgResult.name;
  pkgVersion = pkgResult.version;
};

const start = async () => {
  getPkgInfo();

  program.version(pkgVersion);

  const commandPaths = await getCommand();
  commandPaths &&
    commandPaths.forEach((commandPath) => {
      const { command, descriptor, action, optionList } =
        require(commandPath).default;

      const cmd = program
        .command(command)
        .description(descriptor)
        .action(action);

      optionList &&
        optionList.forEach((option: [string]) => cmd.option(...option));
    });

  program.on('command:*', async ([cmd]) => {
    program.outputHelp();
    error(`Unknown command: ${cmd}`);

    const lasterVersion = await getLasterVersion();

    if (pkgVersion !== lasterVersion) {
      info(`Current pkg has updates, ${pkgVersion} -> ${lasterVersion}`);
    }

    process.exitCode = 1;
  });

  program.parse(process.argv);
};

start();
