/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// React & Redux
const React = require("devtools/client/shared/vendor/react");
const ReactDOM = require("devtools/client/shared/vendor/react-dom");
const { Provider } = require("devtools/client/shared/vendor/react-redux");

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const createStore = require("devtools/client/webconsole/new-console-output/create-store");

const ConsoleOutput = React.createFactory(require("devtools/client/webconsole/new-console-output/components/console-output"));

function OutputWrapperThingy(parentNode, jsterm) {
  this.store = createStore({jsterm});
  let childComponent = ConsoleOutput();
  let provider = React.createElement(Provider, { store: this.store },
    childComponent);
  this.body = ReactDOM.render(provider, parentNode);
}

OutputWrapperThingy.prototype = {
  dispatchMessageAdd: function(message) {
    this.store.dispatch(actions.messageAdd(message));
  },
  dispatchMessagesClear: function() {
    this.store.dispatch(actions.messagesClear());
  }
};

// Exports from this module
module.exports = OutputWrapperThingy;
