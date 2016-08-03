/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const WebConsoleUtils = require("devtools/shared/webconsole/utils").Utils;
const STRINGS_URI = "chrome://devtools/locale/webconsole.properties";
const l10n = new WebConsoleUtils.L10n(STRINGS_URI);

const {
  MESSAGE_SOURCE,
  MESSAGE_TYPE,
  MESSAGE_LEVEL,
} = require("../constants");
const { ConsoleMessage } = require("../types");

function prepareMessage(packet, idGenerator) {
  // This packet is already in the expected packet structure. Simply return.
  if (!packet.source) {
    packet = transformPacket(packet);
  }

  if (packet.allowRepeating) {
    packet = packet.set("repeatId", getRepeatId(packet));
  }
  return packet.set("id", idGenerator.getNextId());
}

/**
 * Transforms a packet from Firefox RDP structure to Chrome RDP structure.
 */
function transformPacket(packet) {
  if (packet._type) {
    packet = convertCachedPacket(packet);
  }

  switch (packet.type) {
    case "consoleAPICall": {
      let { message } = packet;

      let parameters = message.arguments;
      let type = message.level;
      let level = getLevelFromType(type);
      let messageText = null;

      // Special per-type conversion.
      switch (type) {
        case "clear":
          // We show a message to users when calls console.clear() is called.
          parameters = [l10n.getStr("consoleCleared")];
          break;
        case "count":
          // Chrome RDP doesn't have a special type for count.
          type = MESSAGE_TYPE.LOG;
          let {counter} = message;
          let label = counter.label ? counter.label : l10n.getStr("noCounterLabel");
          messageText = `${label}: ${counter.count}`;
          parameters = null;
          break;
      }

      return new ConsoleMessage({
        source: MESSAGE_SOURCE.CONSOLE_API,
        type,
        level,
        parameters,
        messageText,
        stacktrace: message.stacktrace,
      });
    }

    case "pageError": {
      let { pageError } = packet;
      let level = MESSAGE_LEVEL.ERROR;
      if (pageError.warning || pageError.strict) {
        level = MESSAGE_LEVEL.WARN;
      } else if (pageError.info) {
        level = MESSAGE_LEVEL.INFO;
      }

      return new ConsoleMessage({
        source: MESSAGE_SOURCE.JAVASCRIPT,
        type: MESSAGE_TYPE.LOG,
        level,
        messageText: pageError.errorMessage,
      });
    }

    case "evaluationResult":
    default: {
      let { result } = packet;

      return new ConsoleMessage({
        source: MESSAGE_SOURCE.JAVASCRIPT,
        type: MESSAGE_TYPE.RESULT,
        level: MESSAGE_LEVEL.LOG,
        parameters: result,
      });
    }
  }
}

// Helpers
function getRepeatId(message) {
  message = message.toJS();
  delete message.repeat;
  return JSON.stringify(message);
}

function convertCachedPacket(packet) {
  // The devtools server provides cached message packets in a different shape
  // from those of consoleApiCalls, so we prepare them for preparation here.
  let convertPacket = {};
  if (packet._type === "ConsoleAPI") {
    convertPacket.message = packet;
    convertPacket.type = "consoleAPICall";
  } else if (packet._type === "PageError") {
    convertPacket.pageError = packet;
    convertPacket.type = "pageError";
  } else {
    throw new Error("Unexpected packet type");
  }
  return convertPacket;
}

/**
 * Maps a Firefox RDP type to its corresponding level.
 */
function getLevelFromType(type) {
  const severities = {
    SEVERITY_ERROR: "error",
    SEVERITY_WARNING: "warn",
    SEVERITY_INFO: "info",
    SEVERITY_LOG: "log",
    SEVERITY_DEBUG: "debug",
  };

  // A mapping from the console API log event levels to the Web Console
  // severities.
  const levels = {
    error: severities.SEVERITY_ERROR,
    exception: severities.SEVERITY_ERROR,
    assert: severities.SEVERITY_ERROR,
    warn: severities.SEVERITY_WARNING,
    info: severities.SEVERITY_INFO,
    log: severities.SEVERITY_LOG,
    clear: severities.SEVERITY_LOG,
    trace: severities.SEVERITY_LOG,
    table: severities.SEVERITY_LOG,
    debug: severities.SEVERITY_LOG,
    dir: severities.SEVERITY_LOG,
    dirxml: severities.SEVERITY_LOG,
    group: severities.SEVERITY_LOG,
    groupCollapsed: severities.SEVERITY_LOG,
    groupEnd: severities.SEVERITY_LOG,
    time: severities.SEVERITY_LOG,
    timeEnd: severities.SEVERITY_LOG,
    count: severities.SEVERITY_DEBUG,
  };

  return levels[type] || MESSAGE_TYPE.LOG;
}

exports.prepareMessage = prepareMessage;
// Export for use in testing.
exports.getRepeatId = getRepeatId;

exports.l10n = l10n;
