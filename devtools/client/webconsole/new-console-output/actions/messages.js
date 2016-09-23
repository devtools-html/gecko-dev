/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  prepareMessage
} = require("devtools/client/webconsole/new-console-output/utils/messages");
const { IdGenerator } = require("devtools/client/webconsole/new-console-output/utils/id-generator");

const {
  MESSAGE_ADD,
  MESSAGES_CLEAR,
  MESSAGE_OPEN,
  MESSAGE_CLOSE,
  MESSAGE_TYPE,
} = require("../constants");

const defaultIdGenerator = new IdGenerator();

function batchActions(batchedActions) {
  return {
    type: "BATCH_ACTIONS",
    actions: batchedActions,
  };
}

function messageAdd(packet, idGenerator = null) {
  if (idGenerator == null) {
    idGenerator = defaultIdGenerator;
  }
  let message = prepareMessage(packet, idGenerator);
  const addMessageAction = {
    type: MESSAGE_ADD,
    message
  };

  if (message.type === MESSAGE_TYPE.CLEAR) {
    return batchActions([
      messagesClear(),
      addMessageAction,
    ]);
  }
  return addMessageAction;
}

function messagesClear() {
  return {
    type: MESSAGES_CLEAR
  };
}

function messageOpen(id) {
  return {
    type: MESSAGE_OPEN,
    id
  };
}

function messageClose(id) {
  return {
    type: MESSAGE_CLOSE,
    id
  };
}

module.exports = {
  batchActions,
  messageAdd,
  messagesClear,
  messageOpen,
  messageClose,
};
