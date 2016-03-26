/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const {
  createClass,
  createElement,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");

const MessageWrapper = createClass({
  displayName: "MessageWrapper",

  propTypes: {
    packet: PropTypes.object.isRequired,
  },

  render() {
    let MessageComponent = getMessageComponent(this.props.packet);
    return dom.span({className: "message-body-wrapper"},
      createElement(MessageComponent, { packet: this.props.packet })
    );
  }
});

function getMessageComponent(packet) {
  let MessageComponent;
  switch (packet.type) {
    case "consoleAPICall":
      MessageComponent = require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call").ConsoleApiCall;
      break;
  }
  return MessageComponent;
}

module.exports.MessageWrapper = MessageWrapper;
// Exported so we can test it with unit tests.
module.exports.getMessageComponent = getMessageComponent;
