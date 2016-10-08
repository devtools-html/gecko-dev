/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

Cu.import("resource://gre/modules/osfile.jsm");
const TARGET = "networkEvent";
const { [TARGET]: snippets } = require("devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/stub-snippets.js");
const TEST_URI = "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-network-event.html";
// A typical network event request will follow by 8 types of different network
// event update packets
const NETWORK_EVENT_UPDATE_COUNT = 8;

let stubs = {
  preparedMessages: [],
  packets: [],
};

add_task(function* () {
  for (var [key, {keys, code}] of snippets) {
    OS.File.writeAtomic(TEMP_FILE_PATH, `function triggerPacket() {${code}}`);
    let toolbox = yield openNewTabAndToolbox(TEST_URI, "webconsole");
    let {ui} = toolbox.getCurrentPanel().hud;

    ok(ui.jsterm, "jsterm exists");
    ok(ui.newConsoleOutput, "newConsoleOutput exists");

    let networkEvent = new Promise(resolve => {
      let i = 0;
      toolbox.target.activeConsole.on(TARGET, (type, res) => {
        stubs.packets.push(formatPacket(keys[i], res));
        stubs.preparedMessages.push(formatNetworkEventStub(keys[i], res));
        if(++i === keys.length) {
          resolve();
        }
      });
    });

    let networkEventUpdate = new Promise(resolve => {
      let i = 0;
      toolbox.target.activeConsole.on(`${TARGET}Update` , (type, res) => {
        stubs.packets.push(formatPacket(`${keys[0]} ${res.packet.updateType}`, res));
        stubs.preparedMessages.push(formatNetworkEventStub(`${keys[0]} ${res.packet.updateType}`, res));
        if(++i === NETWORK_EVENT_UPDATE_COUNT) {
          resolve();
        }
      });
    });

    yield ContentTask.spawn(gBrowser.selectedBrowser, {}, function() {
      content.wrappedJSObject.triggerPacket();
    });

    yield Promise.all([networkEvent, networkEventUpdate]);
  }
  let filePath = OS.Path.join(`${BASE_PATH}/stubs/${TARGET}.js`);
  OS.File.writeAtomic(filePath, formatFile(stubs));
  OS.File.writeAtomic(TEMP_FILE_PATH, "");
});
