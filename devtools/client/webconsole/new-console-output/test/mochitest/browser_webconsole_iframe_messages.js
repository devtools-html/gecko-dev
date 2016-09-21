/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Check that cached messages from nested iframes are displayed in the
// Web Console.

"use strict";

const TEST_URI = "http://example.com/browser/devtools/client/webconsole/" +
                 "new-console-output/test/mochitest/test-iframes.html";

add_task(function* () {
  // On e10s, the exception is triggered in child process
  // and is ignored by test harness
  if (!Services.appinfo.browserTabsRemoteAutostart) {
    expectUncaughtException();
  }

  let hud = yield openNewTabAndConsole(TEST_URI);
  ok(hud, "web console opened");

  yield waitFor(() => (
    findMessage(hud, "main file")
    && findMessage(hud, "blah")
    && findMessage(hud, "iframe 1")
    && findMessage(hud, "iframe 2")
    && findMessage(hud, "iframe 3")
  ));
  ok(true, "Messages from iframes were displayed in console.");

  // "iframe 1" console messages can be coalesced into one if they follow each
  // other in the sequence of messages (depending on timing). If they do not, then
  // they will be displayed in the console output independently, as separate
  // messages. This is why we need to check multiple possibilities.
  yield waitFor(() => (
    findMessages(hud, "iframe 1").length == 2
    || findMessage(hud, "iframe 1").querySelector(".message-repeats").textContent == 2
  ));
  ok(true, "Messages from nested iframes were displayed in console.");
});
