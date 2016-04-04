/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const packet = testPackets.get("console.log");
const {
  getRepeatId,
  prepareMessage
} = require("devtools/client/webconsole/new-console-output/utils/messages");

function run_test() {
  run_next_test();
}

/**
 * Test getRepeatId().
 */
add_task(function*() {
  const message1 = prepareMessage(packet);
  const message2 = prepareMessage(packet);
  equal(getRepeatId(message1), getRepeatId(message2),
    "getRepeatId() returns same repeat id for objects with the same values");

  message2.data.arguments = ["new args"];
  notEqual(getRepeatId(message1), getRepeatId(message2),
    "getRepeatId() returns different repeat ids for different values");
});

/**
 * Test getRepeatId() with different locations.
 */
add_task(function*() {
  const message1 = prepareMessage(packet);
  const message2 = prepareMessage(packet);

  message2.data.filename = "file:///not-original-file.html";
  notEqual(getRepeatId(message1), getRepeatId(message2),
    "getRepeatId() returns different repeat ids for messages with different locations");
});

/**
 * Test getRepeatId() with different severities.
 */
add_task(function*() {
  const message1 = prepareMessage(packet);
  const message2 = prepareMessage(packet);

  message2.data.level = "error";
  notEqual(getRepeatId(message1), getRepeatId(message2),
    "getRepeatId() returns different repeat ids for messages with different severities");
});

/**
 * Test getRepeatId() with different falsy values.
 */
add_task(function*() {
  const message1 = prepareMessage(packet);
  const message2 = prepareMessage(packet);
  const message3 = prepareMessage(packet);

  message1.data.arguments = [ NaN ];
  message2.data.arguments = [ undefined ];
  message3.data.arguments = [ null ];

  const repeatIds = new Set([
    getRepeatId(message1),
    getRepeatId(message2),
    getRepeatId(message3)]
  );
  equal(repeatIds.size, 3,
    "getRepeatId() handles falsy values distinctly");
});
