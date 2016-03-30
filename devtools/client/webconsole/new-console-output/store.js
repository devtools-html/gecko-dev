/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { combineReducers } = require("devtools/client/shared/vendor/redux");
const createStore = require("devtools/client/shared/redux/create-store")();
const { reducers } = require("./reducers/index");

// We export a factory here so that a new store is created for each test.
// Be careful to only call this once in app code, though. There should only
// be one store in the app.
module.exports = function(initialState = {}) {
  return createStore(combineReducers(reducers), initialState);
};
