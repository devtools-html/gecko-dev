/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

function run_test() {
  run_next_test();
}

add_task(function*() {
  const { getMessageComponent } = require("devtools/client/webconsole/new-console-output/components/message-container");
  const { ConsoleApiCall } = require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call");
  const result = getMessageComponent("ConsoleApiCall");
  equal(result, ConsoleApiCall,
    "getMessageComponent() returns correct component for console.log");
});
