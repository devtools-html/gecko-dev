/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {
  createClass,
  DOM: dom,
  PropTypes
} = require("devtools/client/shared/vendor/react");
const actions = require("devtools/client/webconsole/new-console-output/actions/filters");
const {
  FILTER_TOGGLE
} = require("../constants");

const FilterToggleButton = createClass({

  displayName: "FilterToggleButton",

  propTypes: {
    label: PropTypes.string.isRequired,
    filterType: PropTypes.string.isRequired,
    filterKey: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  },

  onClick: function () {
    if (this.props.filterType === FILTER_TOGGLE) {
      this.props.dispatch(actions.filterToggle(this.props.filterKey));
    }
  },

  render() {
    const {label, active} = this.props;

    let classList = ["menu-filter-button"];
    if (active) {
      classList.push("active");
    }

    return dom.button({
      className: classList.join(" "),
      onClick: this.onClick
    }, label);
  }
});

exports.FilterToggleButton = FilterToggleButton;
