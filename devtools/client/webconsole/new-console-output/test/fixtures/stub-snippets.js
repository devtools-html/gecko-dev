const commands = [
  "console.log('foobar', 'test')",
  "console.log(undefined)",
  "console.warn('danger, will robinson!')",
  "console.log(NaN)",
  "console.log(null)",
  "console.clear()",
  "console.count('bar')",
];

let stubSnippets = new Map(commands.map(cmd => [cmd, cmd]));

stubSnippets.set("console.trace()",
`
function bar() {
  console.trace()
}
function foo() {
  bar()
}

foo()
`);

module.exports = stubSnippets;
