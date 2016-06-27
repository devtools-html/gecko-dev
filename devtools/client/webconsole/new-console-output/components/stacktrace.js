/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const {
  createClass,
  createFactory,
  DOM,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const FunctionCall = createFactory(require("devtools/client/webconsole/new-console-output/components/function-call").FunctionCall);
const Stacktrace = createClass({

  propTypes: {
    stacktrace: PropTypes.array.isRequired
  },

  displayName: "Stacktrace",

  render() {
    const { stacktrace } = this.props;
    return (
      DOM.ul({
        className: "stacktrace devtools-monospace"
      }, buildFunctionCalls(stacktrace))
    );
  }
});

function buildFunctionCalls(stacktrace) {
  return stacktrace.map((item) => DOM.li({}, FunctionCall(item)));
}

module.exports.Stacktrace = Stacktrace;
