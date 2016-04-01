/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const {
  createClass,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");

const ConsoleApiCall = createClass({
  displayName: "ConsoleApiCall",

  propTypes: {
    packet: PropTypes.object.isRequired,
  },

  render() {
    const { message } = this.props.packet;
    return dom.span({className: "message-body-wrapper"},
      dom.span({},
        dom.span({className: "message-flex-body"},
          dom.span({className: "message-body devtools-monospace"},
            dom.span({className: "console-string"}, message.arguments.join(" "))
          )
        )
      )
    );
  }
});

module.exports.ConsoleApiCall = ConsoleApiCall;
