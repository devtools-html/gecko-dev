/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {
  createClass,
  createElement,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const { connect } = require("devtools/client/shared/vendor/react-redux");

function provideJSTermFunctions(Component) {
  const JSTermFunctionProvider = createClass({
    displayName: "JSTermFunctionProvider",

    render() {
      return createElement(Component, this.props);
    }
  });

  function mapStateToProps(state) {
    return {
      jsterm: state.jsterm
    };
  }

  function mergeProps(stateProps, dispatchProps, ownProps) {
    const jsterm = stateProps.jsterm;
    return Object.assign({}, stateProps, dispatchProps, ownProps, {
      openVariablesView: (objectActor) => {
        jsterm.openVariablesView({objectActor});
      }
    });
  }

  return connect(mapStateToProps, null, mergeProps)(JSTermFunctionProvider);
}

module.exports = provideJSTermFunctions;