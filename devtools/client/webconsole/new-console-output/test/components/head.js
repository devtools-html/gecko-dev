/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

var { utils: Cu } = Components;

Cu.import("resource://testing-common/Assert.jsm");
Cu.import("resource://gre/modules/Task.jsm");

var { require } = Cu.import("resource://devtools/shared/Loader.jsm", {});
var { BrowserLoader } = Cu.import("resource://devtools/client/shared/browser-loader.js", {});
var DevToolsUtils = require("devtools/shared/DevToolsUtils");

const Services = require("Services");
Services.scriptloader.loadSubScript("chrome://mochitests/content/chrome/devtools/shared/webconsole/test/common.js", this);

DevToolsUtils.testing = true;
var { require: browserRequire } = BrowserLoader({
  baseURI: "resource://devtools/client/webconsole/",
  window: this
});

let ReactDOM = browserRequire("devtools/client/shared/vendor/react-dom");
let React = browserRequire("devtools/client/shared/vendor/react");
var TestUtils = React.addons.TestUtils;

function* getPacket(command, type = "evaluationResult") {
  try {
    // Attach the console to the tab.
    let state = yield new Promise(function(resolve) {
      attachConsoleToTab(["ConsoleAPI"], (state) => resolve(state));
    });

    // Run the command and get the packet.
    let packet;
    switch (type) {
      case "consoleAPICall":
        packet = yield new Promise((resolve) => {
          function onConsoleApiCall(type, packet) {
            state.dbgClient.removeListener("consoleAPICall", onConsoleApiCall);
            resolve(packet)
          };
          state.dbgClient.addListener("consoleAPICall", onConsoleApiCall)
          eval(`top.${command}`);
        });
        break;
      case "evaluate":
        // @TODO support JavaScriptEvalOutput
        // let evaluated =
        //   new Promise(resolve => state.client.evaluateJSAsync("top.console.log(\"bitty\")", resolve));
        // let packet = yield evaluated;
        break;
    }

    closeDebugger(state);
    return packet;
  } catch (e) {
    ok(false, "Got an error: " + DevToolsUtils.safeErrorString(e));
  }
}

function renderComponent(component, props) {
  const el = React.createElement(component, props, {});
  const renderedComponent = TestUtils.renderIntoDocument(el);
  return ReactDOM.findDOMNode(renderedComponent);
}

function cleanActualHTML(htmlString) {
  return htmlString.replace(/ data-reactid=\".*?\"/g, "");
}

function cleanExpectedHTML(htmlString) {
  return htmlString.replace(/(?:\r\n|\r|\n)\s*/g, "");
}
