/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const packet = testPackets.get("console.log");
const {
  getRepeatId,
  prepareMessage
} = require("devtools/client/webconsole/new-console-output/utils/messages");

function run_test() {
  run_next_test();
}

/**
 * Test adding a message to the store.
 */
add_task(function*() {
  const { getState, dispatch } = storeFactory();

  dispatch(actions.messageAdd(packet));

  const expectedMessage = prepareMessage(packet);

  deepEqual(getState().messages, [expectedMessage],
    "MESSAGE_ADD action adds a message");
});
