/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("devtools/client/shared/vendor/react");
const ReactDOM = require("devtools/client/shared/vendor/react-dom");
const TestUtils = React.addons.TestUtils;

const expect = require("expect");
require("mocha-jsdom")();

const { ConsoleApiCall } = require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call");
const data = require("devtools/client/webconsole/new-console-output/test/data/index");

describe("ConsoleApiCall", function() {
  it("should render a console.log call", function() {
    const testData = data.get("console-log").get("default");
    compareActualToExpected(testData);
  });
});

function compareActualToExpected(testData) {
  const packet = testData.responsePacket;
  const actual = cleanActual(getHtml(packet));
  expect(actual).toEqual(cleanExpected(testData.expectedHTML));
}

function getHtml(packet) {
  const component = React.createElement(ConsoleApiCall, { packet }, {});
  const renderedComponent = TestUtils.renderIntoDocument(component);
  return ReactDOM.findDOMNode(renderedComponent).outerHTML;
}

function cleanActual(htmlString) {
  return htmlString.replace(/ data-reactid=\".*?\"/g, "");
}

function cleanExpected(htmlString) {
  return htmlString.replace(/(?:\r\n|\r|\n)\s*/g, "");
}
