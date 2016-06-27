/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const {
  createClass,
  DOM,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const {l10n} = require("devtools/client/webconsole/new-console-output/utils/messages");

const FunctionCall = createClass({

  propTypes: {
    functionCall: PropTypes.object.isRequired
  },

  displayName: "FunctionCall",

  render() {
    let { functionName, asyncCause} = this.props;

    let isAnonymousFunction = functionName === "";
    let className = isAnonymousFunction ? "cm-comment" : "cm-variable";
    let suffix = isAnonymousFunction ? "" : "()";
    if (isAnonymousFunction) {
      functionName = l10n.getStr("stacktrace.anonymousFunction");
    }

    let asyncCauseText = "";
    if (asyncCause) {
      asyncCauseText = l10n.getFormatStr("stacktrace.asyncStack", [asyncCause]) + " ";
    }

    return (
      DOM.span({className: "function"},
        DOM.span({className: className}, asyncCauseText + functionName),
        suffix
      )
    );
  }
});

module.exports.FunctionCall = FunctionCall;
