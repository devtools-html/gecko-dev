/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

Cu.import("resource://gre/modules/osfile.jsm");
const TEST_URI = "data:text/html;charset=utf-8,stub generation";
const TEST_URI_2 = "http://example.com";

let stubs = {
  preparedMessages: [],
  packets: [],
};

add_task(function* () {
  let toolbox = yield openNewTabAndToolbox(TEST_URI, "webconsole");
  ok(true, "make the test not fail");

  let received = new Promise(resolve => {
    toolbox.target.client.addListener("tabNavigated", function onPacket(type, packet) {
      toolbox.target.client.removeListener("tabNavigated", onPacket);
      info("Received tab navigation action:" + JSON.stringify(packet, null, "\t"));

      let message = prepareMessage(packet, {getNextId: () => 1});
      stubs.packets.push(formatPacket("tabNavigated", packet));
      stubs.preparedMessages.push(formatStub("tabNavigated", message));
      resolve();
    });
  });

  toolbox.target.activeTab.navigateTo(TEST_URI_2);

  yield received;

  let filePath = OS.Path.join(`${BASE_PATH}/stubs`, "tabNavigated.js");
  OS.File.writeAtomic(filePath, formatFile(stubs));
});

function loadTab(url) {
  let deferred = promise.defer();

  let tab = gBrowser.selectedTab = gBrowser.addTab(url);
  let browser = gBrowser.getBrowserForTab(tab);

  browser.addEventListener("load", function onLoad() {
    browser.removeEventListener("load", onLoad, true);
    deferred.resolve({tab: tab, browser: browser});
  }, true);

  return deferred.promise;
}
