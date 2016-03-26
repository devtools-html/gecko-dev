/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const data = new Map();

data.set("default", {
  requestText: "console.log('foobar', 'test')",
  responsePacket: {
    "from": "server1.conn4.child1/consoleActor2",
    "type": "consoleAPICall",
    "message": {
      "arguments": [
        "foobar",
        "test"
      ],
      "columnNumber": 1,
      "counter": null,
      "filename": "file:///test.html",
      "functionName": "",
      "groupName": "",
      "level": "log",
      "lineNumber": 1,
      "private": false,
      "styles": [],
      "timeStamp": 1455064271115,
      "timer": null,
      "workerType": "none",
      "category": "webdev"
    }
  },
  consoleOutput: "foobar test"
});

module.exports = data;
