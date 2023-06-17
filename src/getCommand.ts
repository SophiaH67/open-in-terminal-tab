export class TerminalNotSupportedError extends Error {
  constructor() {
    super('Terminal not supported');
  }
}

export function getCommand(
  cmd: string[],
  name: string,
  returnCommandIfNoMatch = true
): string[] {
  const { TERM } = process.env;
  const cwd = process.cwd();
  const cmdString = cmd.join(' ');

  if (TERM == 'xterm-kitty')
    return [
      'kitty',
      '@',
      'launch',
      '--cwd',
      cwd,
      '--type=tab',
      '--title',
      name,
      '--',
      'bash',
      '-c',
      cmdString,
    ];

  if (process.env.GNOME_TERMINAL_SCREEN || process.env.GNOME_TERMINAL_SERVICE)
    return [
      'gnome-terminal',
      '--tab',
      `--title=${name}`,
      '--',
      'bash',
      '-c',
      cmdString,
    ];

  if (returnCommandIfNoMatch) return cmd;

  throw new TerminalNotSupportedError();
}
