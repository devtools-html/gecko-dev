/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("devtools/client/shared/vendor/react");
const TestUtils = React.addons.TestUtils;

const expect = require("expect");

const data = require("devtools/client/webconsole/new-console-output/test/data/index");
const {
  MessageWrapper,
  getMessageComponent
} = require("devtools/client/webconsole/new-console-output/components/message-wrapper");

describe("MessageWrapper component", function() {
  it("nests the correct child component based on the packet", function() {
    const MessageWrapperFactory = React.createFactory(MessageWrapper);
    const ConsoleApiCall = require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call").ConsoleApiCall;

    const test = MessageWrapperFactory({
      packet: data.get("console-log").get("default").responsePacket
    });

    const renderer = TestUtils.createRenderer();
    renderer.render(test, {});
    let result = renderer.getRenderOutput();

    expect(result.props.children.type).toEqual(ConsoleApiCall);
  });

  describe("getMessageComponent() helper", function() {
    it("returns the right component for console-log packets", function() {
      const ConsoleApiCall = require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call").ConsoleApiCall;
      const packet = data.get("console-log").get("default").responsePacket;
      const result = getMessageComponent(packet);
      expect(result).toBe(ConsoleApiCall);
    });
  });
});
