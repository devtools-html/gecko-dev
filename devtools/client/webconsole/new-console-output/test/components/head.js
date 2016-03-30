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

function* testComponentWithRDP(testValues) {
  let {command, component, expectedHTML} = testValues
  try {
    let ReactDOM = browserRequire("devtools/client/shared/vendor/react-dom");
    let React = browserRequire("devtools/client/shared/vendor/react");
    var TestUtils = React.addons.TestUtils;

    // Attach the console to the tab.
    let state = yield new Promise(function(resolve) {
      attachConsoleToTab(["ConsoleAPI"], (state) => resolve(state));
    })

    // Run the command and get the packet.
    let packet;
    switch (command.type) {
      case "console":
        packet = yield new Promise((resolve) => {
          function onConsoleApiCall(type, packet) {
            state.dbgClient.removeListener("consoleAPICall", onConsoleApiCall);
            resolve(packet)
          };
          state.dbgClient.addListener("consoleAPICall", onConsoleApiCall)
          eval(`top.${command.string}`);
        });
        break;
      case "eval":
        // @TODO support JavaScriptEvalOutput
        // let evaluated =
        //   new Promise(resolve => state.client.evaluateJSAsync("top.console.log(\"bitty\")", resolve));
        // let packet = yield evaluated;
        break;
    }

    // Render the component using the packet.
    const el = React.createElement(component, { packet }, {});
    const renderedComponent = TestUtils.renderIntoDocument(el);

    // Test the actual and expected HTML.
    const actual = cleanActual(ReactDOM.findDOMNode(renderedComponent).outerHTML);
    is(actual, cleanExpected(expectedHTML), "Matched component HTML");

    closeDebugger(state);
  } catch (e) {
    ok(false, "Got an error: " + DevToolsUtils.safeErrorString(e));
  }
}

function cleanActual(htmlString) {
  return htmlString.replace(/ data-reactid=\".*?\"/g, "");
}

function cleanExpected(htmlString) {
  return htmlString.replace(/(?:\r\n|\r|\n)\s*/g, "");
}
