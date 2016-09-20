/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */
/* import-globals-from ../../../../framework/test/shared-head.js */

"use strict";

// shared-head.js handles imports, constants, and utility functions
// Load the shared-head file first.
Services.scriptloader.loadSubScript(
  "chrome://mochitests/content/browser/devtools/client/framework/test/shared-head.js",
  this);

Services.prefs.setBoolPref("devtools.webconsole.new-frontend-enabled", true);
registerCleanupFunction(function* () {
  Services.prefs.clearUserPref("devtools.webconsole.new-frontend-enabled");

  let browserConsole = HUDService.getBrowserConsole();
  if (browserConsole) {
    if (browserConsole.jsterm) {
      browserConsole.jsterm.clearOutput(true);
    }
    yield HUDService.toggleBrowserConsole();
  }
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

/**
 * Open the Web Console for the given tab.
 *
 * @param nsIDOMElement [tab]
 *        Optional tab element for which you want open the Web Console. The
 *        default tab is taken from the global variable |tab|.
 * @param function [callback]
 *        Optional function to invoke after the Web Console completes
 *        initialization (web-console-created).
 * @return object
 *         A promise that is resolved once the web console is open.
 */
var openConsole = function (tab) {
  let webconsoleOpened = promise.defer();
  let target = TargetFactory.forTab(tab || gBrowser.selectedTab);
  gDevTools.showToolbox(target, "webconsole").then(toolbox => {
    let hud = toolbox.getCurrentPanel().hud;
    hud.jsterm._lazyVariablesView = false;
    webconsoleOpened.resolve(hud);
  });
  return webconsoleOpened.promise;
};

/**
 * Wait for messages in the web console output, resolving once they are receieved.
 *
 * @param object options
 *        - hud: the webconsole
 *        - messages: Array[Object]. An array of messages to match. Current supported options:
 *            - text: Exact text match in .message-body
 */
function waitForMessages({ hud, messages }) {
  return new Promise(resolve => {
    let numMatched = 0;
    let receivedLog = hud.ui.on("new-messages", function messagesReceieved(e, newMessage) {
      for (let message of messages) {
        if (message.matched) {
          continue;
        }

        if (newMessage.node.querySelector(".message-body").textContent == message.text) {
          numMatched++;
          message.matched = true;
          info("Matched a message with text: " + message.text + ", still waiting for " + (messages.length - numMatched) + " messages");
        }

        if (numMatched === messages.length) {
          hud.ui.off("new-messages", messagesReceieved);
          resolve(receivedLog);
          return;
        }
      }
    });
  });
}

/**
 * Wait for a predicate to return a result.
 *
 * @param function condition
 *        Invoked once in a while until it returns a truthy value. This should be an
 *        idempotent function, since we have to run it a second time after it returns
 *        true in order to return the value.
 * @param string message [optional]
 *        A message to output if the condition failes.
 * @param number interval [optional]
 *        How often the predicate is invoked, in milliseconds.
 * @return object
 *         A promise that is resolved with the result of the condition.
 */
function* waitFor(condition, message = "waitFor", interval = 100, maxTries = 50) {
  return new Promise(resolve => {
    BrowserTestUtils.waitForCondition(condition, message, interval, maxTries)
      .then(resolve(condition()));
  });
}

/**
 * Find a message in the output.
 *
 * @param object hud
 *        The web console.
 * @param string text
 *        A substring that can be found in the message.
 * @param selector [optional]
 *        The selector to use in finding the message.
 */
function findMessage(hud, text, selector = ".message") {
  const elements = Array.prototype.filter.call(
    hud.ui.experimentalOutputNode.querySelectorAll(selector),
    (el) => el.textContent.includes(text)
  );
  return elements.pop();
}
