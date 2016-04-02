/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const constants = require("devtools/client/webconsole/new-console-output/constants");

function run_test() {
  run_next_test();
}

add_task(function*() {
  const packet = testPackets.get("console.log");
  const action = actions.messageAdd(packet);
  const expected = {
    type: constants.MESSAGE_ADD,
    message: {
      allowRepeating: true,
      category: "console",
      data: packet.message,
      messageType: "ConsoleApiCall",
      severity: "log"
    }
  };
  deepEqual(action, expected,
    "messageAdd action creator returns expected action object");
});

add_task(function*() {
  const action = actions.messagesClear();
  const expected = {
    type: constants.MESSAGES_CLEAR,
  };
  deepEqual(action, expected,
    "messagesClear action creator returns expected action object");
});
