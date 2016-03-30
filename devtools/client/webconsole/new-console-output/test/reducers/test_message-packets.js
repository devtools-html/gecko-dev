/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const testPacket = testPackets.get("console-log");

function run_test() {
  run_next_test();
}

add_task(function*() {
  const { getState, dispatch } = Store;

  dispatch(actions.messageAdd(testPacket));
  const expectedPacket = Object.assign({}, testPacket);
  deepEqual(getState().messages, [expectedPacket],
    "MESSAGE_ADD action adds a message");
});
