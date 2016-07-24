/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const { getAllMessages } = require("devtools/client/webconsole/new-console-output/selectors/messages");
const { setupStore } = require("devtools/client/webconsole/new-console-output/test/helpers");
const { stubConsoleMessages } = require("devtools/client/webconsole/new-console-output/test/fixtures/stubs");

const expect = require("expect");

describe("Message reducer:", () => {
  describe("adds a message to an empty store", () => {
    const { dispatch, getState } = setupStore([]);
    const message = stubConsoleMessages.get("console.log('foobar', 'test')");
    dispatch(actions.messageAdd(message));

    const messages = getAllMessages(getState());
    expect(messages.size).toBe(1);
  });
});
