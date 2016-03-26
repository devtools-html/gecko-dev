/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const expect = require("expect");

const actions = require("devtools/client/webconsole/new-console-output/actions/messages");
const constants = require("devtools/client/webconsole/new-console-output/constants");

describe("Message action creator", function() {
  describe("messsageAdd()", function() {
    it("creates expected action", function() {
      let packet = {};
      let action = actions.messageAdd(packet);
      expect(action).toEqual({
        type: constants.MESSAGE_ADD,
        packet: {}
      });
    });
  });

  describe("messsagesClear()", function() {
    it("creates expected action", function() {
      let action = actions.messagesClear();
      expect(action).toEqual({
        type: constants.MESSAGES_CLEAR
      });
    });
  });
});
