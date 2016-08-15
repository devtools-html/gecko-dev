/* Any copyright is dedicated to the Public Domain.
  http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const {
  MESSAGE_SOURCE,
  MESSAGE_TYPE,
  MESSAGE_LEVEL,
} = require("devtools/client/webconsole/new-console-output/constants");

const { ConsoleMessage } = require("devtools/client/webconsole/new-console-output/types");

let stubConsoleMessages = new Map();

stubConsoleMessages.set("ReferenceError: asdf is not defined", new ConsoleMessage({
	"id": "1",
	"allowRepeating": true,
	"source": "javascript",
	"type": "log",
	"level": "error",
	"messageText": "ReferenceError: asdf is not defined",
	"parameters": null,
	"repeat": 1,
	"repeatId": "{\"id\":null,\"allowRepeating\":true,\"source\":\"javascript\",\"type\":\"log\",\"level\":\"error\",\"messageText\":\"ReferenceError: asdf is not defined\",\"parameters\":null,\"repeatId\":null,\"stacktrace\":null,\"frame\":null}",
	"stacktrace": null,
	"frame": null
}));


module.exports = stubConsoleMessages