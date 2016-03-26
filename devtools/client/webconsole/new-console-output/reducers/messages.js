/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const Immutable = require("devtools/client/shared/vendor/immutable");

const constants = require("devtools/client/webconsole/new-console-output/constants");

function messages(state = [], action) {
  switch (action.type) {
    case constants.MESSAGE_ADD:
      return state.concat([action.packet]);
    case constants.MESSAGES_CLEAR:
      return [];
  }

  return state;
}

exports.messages = messages;
