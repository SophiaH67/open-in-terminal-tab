import { Command } from 'commander';
import { getCommand } from './getCommand';
import spawn from 'cross-spawn';

const packageJson = require('../package.json');
const version: string = packageJson.version;

const program = new Command();

program
  .version(version)
  .name('open-in-terminal-tab')
  .description('Execute a given command in a new terminal tab')
  .arguments('<command>')
  .option('-t, --title <title>', 'title of the new terminal tab', 'NewTab')
  .parse(process.argv);

const options = program.opts();

const commandToRun = getCommand(program.args, options.title);

const [command, ...args] = commandToRun;

// Below is taken from cross-env
// https://github.com/kentcdodds/cross-env/blob/3edefc7b450fe273655664f902fd03d9712177fe/src/index.js#L13-L36
const proc = spawn(command, args);

process.on('SIGTERM', () => proc.kill('SIGTERM'));
process.on('SIGINT', () => proc.kill('SIGINT'));
process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
process.on('SIGHUP', () => proc.kill('SIGHUP'));
proc.on('exit', (code, signal) => {
  let crossEnvExitCode = code;
  // exit code could be null when OS kills the process(out of memory, etc) or due to node handling it
  // but if the signal is SIGINT the user exited the process so we want exit code 0
  if (crossEnvExitCode === null) {
    crossEnvExitCode = signal === 'SIGINT' ? 0 : 1;
  }
  process.exit(crossEnvExitCode); //eslint-disable-line no-process-exit
});
