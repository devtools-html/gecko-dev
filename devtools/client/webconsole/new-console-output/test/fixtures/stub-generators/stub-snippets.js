/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

var {DebuggerServer} = require("devtools/server/main");
var longString = (new Array(DebuggerServer.LONG_STRING_LENGTH + 4)).join("a");

// Console API

const consoleApiCommands = [
  // Log
  "console.log('foobar', 'test')",
  "console.log(undefined)",
  "console.log(NaN)",
  "console.log(null)",
  "console.log('\u9f2c')",
  "console.log('hello \\nfrom \\rthe \\\"string world!')",
  "console.log('\xFA\u1E47\u0129\xE7\xF6d\xEA \u021B\u0115\u0219\u0165')",
  "console.log('')",
  "console.log(0)",
  "console.log('0')",
  "console.log(/foobar/)",
  "console.log(Symbol('foo'))",

  // Warn
  "console.warn('danger, will robinson!')",

  // Assert
  "console.assert(false, {message: 'foobar'})",

  // Clear
  "console.clear()",

  // Count
  "console.count('bar')",
];

let consoleApi = new Map(consoleApiCommands.map(
  cmd => [cmd, {keys: [cmd], code: cmd}]));

// console.log a long string. It's handled this way so the key can be shorter.
consoleApi.set("console.log(longString)", {
  keys: [`console.log(longString)`],
  code: `console.log('${longString}')`
});

// Trace
consoleApi.set("console.trace()", {
  keys: ["console.trace()"],
  code: `
function testStacktraceFiltering() {
  console.trace()
}
function foo() {
  testStacktraceFiltering()
}

foo()
`});

// Time
consoleApi.set("console.time('bar')", {
  keys: ["console.time('bar')", "console.timeEnd('bar')"],
  code: `
console.time("bar");
console.timeEnd("bar");
`});

// Evaluation Result

const evaluationResultCommands = [
  "new Date(0)",
  "asdf()"
];

let evaluationResult = new Map(evaluationResultCommands.map(cmd => [cmd, cmd]));

// Network Event

let networkEvent = new Map();

networkEvent.set("GET request", {
  keys: ["GET request"],
  code: `
let i = document.createElement("img");
i.src = "inexistent.html";
`});

networkEvent.set("XHR GET request", {
  keys: ["XHR GET request"],
  code: `
const xhr = new XMLHttpRequest();
xhr.open("GET", "inexistent.html");
xhr.send();
`});

networkEvent.set("XHR POST request", {
  keys: ["XHR POST request"],
  code: `
const xhr = new XMLHttpRequest();
xhr.open("POST", "inexistent.html");
xhr.send();
`});

// Page Error

let pageError = new Map();

pageError.set("Reference Error", `
  function bar() {
    asdf()
  }
  function foo() {
    bar()
  }

  foo()
`);

module.exports = {
  consoleApi,
  evaluationResult,
  networkEvent,
  pageError,
};
