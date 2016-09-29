/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const {
  createFactory,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const MessageIcon = createFactory(require("devtools/client/webconsole/new-console-output/components/message-icon").MessageIcon);

Message.displayName = "Message";

Message.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  topLevelClasses: PropTypes.array,
  messageBody: PropTypes.any.isRequired,
};

Message.defaultProps = {
  topLevelClasses: [],
};

function Message(props) {
  const {
    source,
    type,
    level,
    topLevelClasses: classes,
    messageBody,
  } = props;

  const icon = MessageIcon({level});

  classes.push("message");
  classes.push(source);
  classes.push(type);
  classes.push(level);

  return dom.div({ className: classes.join(" ") },
    // @TODO add timestamp
    // @TODO add indent if necessary
    icon,
    dom.span({ className: "message-body-wrapper" },
      dom.span({ className: "message-flex-body" },
        dom.span({ className: "message-body devtools-monospace" },
          messageBody
        )
      )
    )
  );
}

module.exports = Message;
