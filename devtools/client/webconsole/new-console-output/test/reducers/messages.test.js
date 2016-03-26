/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const expect = require("expect");

const constants = require("devtools/client/webconsole/new-console-output/constants");
const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const reducer = require("devtools/client/webconsole/new-console-output/reducers/messages").messages;

const consoleLogTestData = require("devtools/client/webconsole/new-console-output/test/data/console-log");

describe("Message reducer", () => {

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it("handles the MESSAGE_ADD action", () => {
    const { responsePacket } = consoleLogTestData.get("default");
    const action = actions.messageAdd(responsePacket);
    const expectedMessage = Object.assign({}, responsePacket);
    const result = reducer([], action);

    expect(result).toEqual([expectedMessage]);
  });
});
