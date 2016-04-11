/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {
  createClass,
  createFactory,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const { connect } = require("devtools/client/shared/vendor/react-redux");

const MessageContainer = createFactory(require("devtools/client/webconsole/new-console-output/components/message-container").MessageContainer);

const ConsoleOutput = createClass({
  displayName: "ConsoleOutput",

  propTypes: {
    jsterm: PropTypes.object.isRequired,
    // This function is created in mergeProps
    openVariablesView: PropTypes.func.isRequired
  },

  render() {
    const { openVariablesView } = this.props;
    let messageNodes = this.props.messages.map(function(message) {
      return (
        MessageContainer({ message, openVariablesView })
      );
    });
    return (
      dom.div({}, messageNodes)
    );
  }
});

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const jsterm = ownProps.jsterm;
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    openVariablesView: (objectActor) => {
      jsterm.openVariablesView({objectActor});
    }
  });
}

module.exports = connect(mapStateToProps, null, mergeProps)(ConsoleOutput);
