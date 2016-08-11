const commands = [
  "console.log('foobar', 'test')",
  "console.log(undefined)",
  "console.warn('danger, will robinson!')",
  "console.log(NaN)",
  "console.log(null)",
  "console.clear()",
  "console.count('bar')",
];

module.exports = new Map(commands.map(cmd => [cmd, cmd]));
