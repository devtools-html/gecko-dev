/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

Cu.import("resource://gre/modules/osfile.jsm");
const { consoleApi: snippets } = require("devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/stub-snippets.js");

const TEST_URI = "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-console-api.html";

let stubs = {
  preparedMessages: [],
  packets: [],
};

add_task(function* () {
  for (var [key, {keys, code}] of snippets) {
    const writeFile = OS.File.writeAtomic(TEMP_FILE_PATH, `function triggerPacket() {${code}}`);

    yield writeFile;

    let decoder = new TextDecoder();        // This decoder can be reused for several reads
    let file = yield OS.File.read(TEMP_FILE_PATH); // Read the complete file as an array
    info("print files " + key);
    ok(false, decoder.decode(file));

    let toolbox = yield openNewTabAndToolbox(TEST_URI, "webconsole");
    let hud = toolbox.getCurrentPanel().hud;
    let {ui} = hud;

    ok(ui.jsterm, "jsterm exists");
    ok(ui.newConsoleOutput, "newConsoleOutput exists");

    let received = new Promise(resolve => {
      let i = 0;
      let listener = (type, res) => {
        info(keys);
        info(JSON.stringify(res));
        stubs.packets.push(formatPacket(keys[i], res));
        stubs.preparedMessages.push(formatStub(keys[i], res));
        if(++i === keys.length ){
          toolbox.target.client.removeListener("consoleAPICall", listener);
          resolve();
        }
      };
      toolbox.target.client.addListener("consoleAPICall", listener);
    });

    yield ContentTask.spawn(gBrowser.selectedBrowser, {}, function() {
      content.wrappedJSObject.triggerPacket();
    });

    yield received;

    yield closeTabAndToolbox();
  }
  let filePath = OS.Path.join(`${BASE_PATH}/stubs`, "consoleApi.js");
  OS.File.writeAtomic(filePath, formatFile(stubs));
  OS.File.writeAtomic(TEMP_FILE_PATH, "");
});
