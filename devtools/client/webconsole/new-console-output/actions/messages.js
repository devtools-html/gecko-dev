/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const constants = require("../constants");

function messageAdd(packet) {
  let message = prepareMessage(packet);
  return {
    type: constants.MESSAGE_ADD,
    message
  };
}

function messagesClear() {
  return {
    type: constants.MESSAGES_CLEAR
  };
}

function prepareMessage(packet) {
  let allowRepeating;
  let category;
  let data;
  let messageType;
  let severity;

  const level = constants.LEVELS[packet.message.level];
  switch (packet.type) {
    case "consoleAPICall":
      allowRepeating = true;
      category = "console";
      data = packet.message;
      messageType = "ConsoleApiCall";
      severity = constants.SEVERITY_CLASS_FRAGMENTS[level];
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