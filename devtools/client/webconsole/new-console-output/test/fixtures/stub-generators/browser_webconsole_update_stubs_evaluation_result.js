/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

var { DebuggerServer } = require("devtools/server/main");
var { DebuggerClient } = require("devtools/shared/client/main");

Cu.import("resource://gre/modules/osfile.jsm");
const { evaluationResult: snippets} = require("devtools/client/webconsole/new-console-output/test/fixtures/stub-snippets.js");

let stubs = [];

snippets.forEach((code, key) => {
  add_task(function* () {
    ok(true, "make the test not fail");

    const packet = yield getPacket(code);
    stubs.push(formatStub(key, packet));
    if (stubs.length == snippets.size) {
      let filePath = OS.Path.join(`${BASE_PATH}/stubs`, "evaluationResult.js");
      OS.File.writeAtomic(filePath, formatFile(stubs));
    }
  });
});

function* getPacket(command, type = "evaluationResult") {
  try {
    // Attach the console to the tab.
    let state = yield new Promise(function (resolve) {
      attachConsoleToTab(["ConsoleAPI"], resolve);
    });

    // Run the command and get the packet.
    let packet;
    switch (type) {
      case "consoleAPICall":
        packet = yield new Promise((resolve) => {
          function onConsoleApiCall(apiCallType, apiCallPacket) {
            state.dbgClient.removeListener("consoleAPICall", onConsoleApiCall);
            resolve(apiCallPacket);
          }
          state.dbgClient.addListener("consoleAPICall", onConsoleApiCall);
          state.client.evaluateJS(`top.${command}`);
        });
        break;
      case "evaluationResult":
        packet = yield new Promise(resolve => {
          state.client.evaluateJS(command, resolve);
        });
        break;
      case "pageError":
        // @TODO: get packet with RDP
        packet = {
          "from": "server1.conn1.child1/consoleActor2",
          "type": "pageError",
          "pageError": {
            "errorMessage": "ReferenceError: asdf is not defined",
            "sourceName": "data:text/html,<script>asdf</script>",
            "lineText": "",
            "lineNumber": 1,
            "columnNumber": 1,
            "category": "content javascript",
            "timeStamp": 1455735574091,
            "warning": false,
            "error": false,
            "exception": true,
            "strict": false,
            "info": false,
            "private": false,
            "stacktrace": [{
              "columnNumber": 68,
              "filename": "test.html",
              "functionName": "baz",
              "language": 2,
              "lineNumber": 1
            }, {
              "columnNumber": 43,
              "filename": "test.html",
              "functionName": "bar",
              "language": 2,
              "lineNumber": 2
            }, {
              "columnNumber": 18,
              "filename": "test.html",
              "functionName": "foo",
              "language": 2,
              "lineNumber": 3
            }, {
              "columnNumber": 150,
              "filename": "test.html",
              "functionName": "",
              "language": 2,
              "lineNumber": 4
            }]
          }
        };
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
  // By default, renderIntoDocument() won't work for stateless components, but
  // it will work if the stateless component is wrapped in a stateful one.
  // See https://github.com/facebook/react/issues/4839
  const wrappedEl = React.DOM.span({}, [el]);
  const renderedComponent = TestUtils.renderIntoDocument(wrappedEl);
  return ReactDOM.findDOMNode(renderedComponent).children[0];
}

function shallowRenderComponent(component, props) {
  const el = React.createElement(component, props);
  const renderer = TestUtils.createRenderer();
  renderer.render(el, {});
  return renderer.getRenderOutput();
}

function cleanActualHTML(htmlString) {
  return htmlString.replace(/ data-reactid=\".*?\"/g, "");
}

function cleanExpectedHTML(htmlString) {
  return htmlString.replace(/(?:\r\n|\r|\n)\s*/g, "");
}

// Helpers copied in from shared/webconsole/test/common.js
function initCommon()
{
  // Services.prefs.setBoolPref("devtools.debugger.log", true);
}

function initDebuggerServer()
{
  if (!DebuggerServer.initialized) {
    DebuggerServer.init();
    DebuggerServer.addBrowserActors();
  }
  DebuggerServer.allowChromeProcess = true;
}

function connectToDebugger(aCallback)
{
  initCommon();
  initDebuggerServer();

  let transport = DebuggerServer.connectPipe();
  let client = new DebuggerClient(transport);

  let dbgState = { dbgClient: client };
  client.connect().then(response => aCallback(dbgState, response));
}

function closeDebugger(aState, aCallback)
{
  aState.dbgClient.close(aCallback);
  aState.dbgClient = null;
  aState.client = null;
}

function attachConsole(aListeners, aCallback) {
  _attachConsole(aListeners, aCallback);
}
function attachConsoleToTab(aListeners, aCallback) {
  _attachConsole(aListeners, aCallback, true);
}
function attachConsoleToWorker(aListeners, aCallback) {
  _attachConsole(aListeners, aCallback, true, true);
}

function _attachConsole(aListeners, aCallback, aAttachToTab, aAttachToWorker)
{
  function _onAttachConsole(aState, aResponse, aWebConsoleClient)
  {
    if (aResponse.error) {
      console.error("attachConsole failed: " + aResponse.error + " " +
                    aResponse.message);
    }

    aState.client = aWebConsoleClient;

    aCallback(aState, aResponse);
  }

  connectToDebugger(function _onConnect(aState, aResponse) {
    if (aResponse.error) {
      console.error("client.connect() failed: " + aResponse.error + " " +
                    aResponse.message);
      aCallback(aState, aResponse);
      return;
    }

    if (aAttachToTab) {
      aState.dbgClient.listTabs(function _onListTabs(aResponse) {
        if (aResponse.error) {
          console.error("listTabs failed: " + aResponse.error + " " +
                         aResponse.message);
          aCallback(aState, aResponse);
          return;
        }
        let tab = aResponse.tabs[aResponse.selected];
        aState.dbgClient.attachTab(tab.actor, function (response, tabClient) {
          if (aAttachToWorker) {
            var worker = new Worker("console-test-worker.js");
            worker.addEventListener("message", function listener() {
              worker.removeEventListener("message", listener);
              tabClient.listWorkers(function (response) {
                tabClient.attachWorker(response.workers[0].actor, function (response, workerClient) {
                  workerClient.attachThread({}, function (aResponse) {
                    aState.actor = workerClient.consoleActor;
                    aState.dbgClient.attachConsole(workerClient.consoleActor, aListeners,
                                                   _onAttachConsole.bind(null, aState));
                  });
                });
              });
            });
          } else {
            aState.actor = tab.consoleActor;
            aState.dbgClient.attachConsole(tab.consoleActor, aListeners,
                                           _onAttachConsole.bind(null, aState));
          }
        });
      });
    } else {
      aState.dbgClient.getProcess().then(response => {
        aState.dbgClient.attachTab(response.form.actor, function () {
          let consoleActor = response.form.consoleActor;
          aState.actor = consoleActor;
          aState.dbgClient.attachConsole(consoleActor, aListeners,
                                         _onAttachConsole.bind(null, aState));
        });
      });
    }
  });
}