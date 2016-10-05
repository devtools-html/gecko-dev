/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Check console.group, console.groupCollapsed and console.groupEnd calls
// behave as expected.

const TEST_URI = "http://example.com/browser/devtools/client/webconsole/new-console-output/test/mochitest/test-console-group.html";

add_task(function* () {
  let toolbox = yield openNewTabAndToolbox(TEST_URI, "webconsole");
  let hud = toolbox.getCurrentPanel().hud;

  const testCases = [{
    info: "Add a group at root level",
    fn: "doConsoleGroup",
    input: "foo",
    expectedText: "foo",
    expectedIndent: 0
  }, {
    info: "Add a message in 1 level deep group",
    fn: "doConsoleLog",
    input: "foo",
    expectedText: "foo",
    expectedIndent: 1
  }, {
    info: "Add a group in another group",
    fn: "doConsoleGroup",
    input: "bar",
    expectedText: "bar",
    expectedIndent: 1
  }, {
    info: "Add a message in a 2 level deep group",
    fn: "doConsoleLog",
    input: "bar",
    expectedText: "bar",
    expectedIndent: 2
  }, {
    fn: "doConsoleGroupEnd",
    input: "bar",
    expectedText: null
  }, {
    info: "Add a message in 1 level deep group, after closing a 2 level deep group",
    fn: "doConsoleLog",
    input: "foobar",
    expectedText: "foobar",
    expectedIndent: 1
  }, {
    fn: "doConsoleGroupEnd",
    input: "foo",
    expectedText: null
  }, {
    info: "Add a message at root level, after closing all the groups",
    fn: "doConsoleLog",
    input: "foar",
    expectedText: "foar",
    expectedIndent: 0
  }, {
    info: "Add a collapsed group at root level",
    fn: "doConsoleGroupCollapsed",
    input: "collapsed",
    expectedText: "collapsed",
    expectedIndent: 0
  }, {
    fn: "doConsoleLog",
    input: "in-collapsed",
    expectedText: null
  }, {
    fn: "doConsoleGroupEnd",
    input: "collapsed",
    expectedText: null
  }, {
    info: "Add a message at root level, after closing a collapsed group",
    fn: "doConsoleLog",
    input: "out-collapsed",
    expectedText: "out-collapsed",
    expectedIndent: 0
  }];

  let classes = {
    "doConsoleLog": "log",
    "doConsoleGroup": "startGroup",
    "doConsoleGroupCollapsed": "startGroupCollapsed",
  };

  yield ContentTask.spawn(gBrowser.selectedBrowser, testCases, function (tests) {
    tests.forEach((test) => {
      content.wrappedJSObject[test.fn](test.input);
    });
  });

  let messageCreatorTestCases = testCases.filter(test => test.expectedText);

  let nodes = [];
  for (let testCase of messageCreatorTestCases) {
    const {expectedIndent} = testCase;
    let node = yield waitFor(() => findConsoleMessage(
      hud.ui.experimentalOutputNode, expectedIndent, nodes.length)
    );
    nodes.push(node);
  }

  let messageNodes = hud.ui.experimentalOutputNode.querySelectorAll(".message");
  is(messageNodes.length, messageCreatorTestCases.length,
    "console has the expected number of message");

  messageCreatorTestCases.forEach((testCase, index) => {
    info(testCase.info);
    const {expectedIndent, expectedText, fn} = testCase;
    let node = messageNodes[index];

    ok(node.classList.contains(classes[fn]), "message has the expected class");
    is(node.querySelector(".message-body").textContent, expectedText,
      "message has the expected text");
    is(node.querySelector(".indent").getAttribute("data-indent"), expectedIndent,
      "message has the expected level of indentation");
  });
});

function findConsoleMessage(node, indent = 0, index) {
  let condition = node.querySelector(
    `.message:nth-of-type(${index + 1}) .indent[data-indent="${indent}"]`);
  return condition.closest(".message");
}
