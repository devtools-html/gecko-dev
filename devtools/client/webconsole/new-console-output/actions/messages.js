/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {
  MESSAGE_ADD,
  MESSAGES_CLEAR,
  LEVELS,
  SEVERITY_CLASS_FRAGMENTS
} = require("../constants");

function messageAdd(packet) {
  let message = prepareMessage(packet);
  return {
    type: MESSAGE_ADD,
    message
  };
}

function messagesClear() {
  return {
    type: MESSAGES_CLEAR
  };
}

function prepareMessage(packet) {
  let allowRepeating;
  let category;
  let data;
  let messageType;
  let severity;

  switch (packet.type) {
    case "consoleAPICall":
      allowRepeating = true;
      category = "console";
      data = Object.assign({}, packet.message);
      messageType = "ConsoleApiCall";
      severity = SEVERITY_CLASS_FRAGMENTS[LEVELS[packet.message.level]];
      break;
  }

  return {
    allowRepeating,
    category,
    data,
    messageType,
    severity
  };
}

exports.messageAdd = messageAdd;
exports.messagesClear = messagesClear;
// Export for use in testing.
exports.prepareMessage = prepareMessage;