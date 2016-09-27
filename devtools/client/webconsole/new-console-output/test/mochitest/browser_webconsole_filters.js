/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Tests filters.

"use strict";

const { MESSAGE_LEVEL } = require("devtools/client/webconsole/new-console-output/constants");

const TEST_URI = "http://example.com/browser/devtools/client/webconsole/new-console-output/test/mochitest/test-console-filters.html";

add_task(function* () {
  let hud = yield openNewTabAndConsole(TEST_URI);
  const outputNode1 = hud.ui.experimentalOutputNode;

  const toolbar1 = yield waitFor(() => {
    return outputNode1.querySelector(".webconsole-filterbar-primary");
  });
  info("Toolbar found");

  // Show the filter bar
  EventUtils.sendMouseEvent({type: "click"},
    toolbar1.querySelector(".devtools-filter-icon"));
  const filterBar1 = yield waitFor(() => {
    return outputNode1.querySelector(".webconsole-filterbar-secondary");
  });
  ok(filterBar1, "Filter bar is shown when filter icon is clicked.");

  // Check defaults.
  Object.values(MESSAGE_LEVEL).forEach(level => {
    ok(filterIsEnabled(filterBar1.querySelector(`.${level}`)),
      `Filter button for ${level} is on by default`);
  });
  ["net", "netxhr"].forEach(category => {
    ok(!filterIsEnabled(filterBar1.querySelector(`.${category}`)),
      `Filter button for ${category} is off by default`);
  });

  // Check that messages are shown as expected. This depends on cached messages being
  // shown.
  ok(findMessages(hud, "").length == 5,
    "Messages of all levels shown when filters are on.");

  // Check that messages are not shown when their filter is turned off.
  EventUtils.sendMouseEvent({type: "click"}, filterBar1.querySelector(".error"));
  yield waitFor(() => findMessages(hud, "").length == 4);
  ok(true, "When a filter is turned off, its messages are not shown.");

  // Check that the ui settings were persisted.
  yield closeToolbox;
  hud = yield openNewTabAndConsole(TEST_URI);
  const outputNode2 = hud.ui.experimentalOutputNode;
  const filterBar2 = yield waitFor(() => {
    return outputNode2.querySelector(".webconsole-filterbar-secondary");
  });
  ok(filterBar2, "Filter bar ui setting is persisted.");

  // Check that the filter settings were persisted.
  ok(!filterIsEnabled(filterBar2.querySelector(".error")),
    "Filter button setting is persisted");
  ok(findMessages(hud, "").length == 4,
    "Messages of all levels shown when filters are on.");
});

function filterIsEnabled(button) {
  return button.classList.contains("checked");
}
