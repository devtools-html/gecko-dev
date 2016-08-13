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

stubConsoleMessages.set("key", new ConsoleMessage({
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

stubConsoleMessages.set("key", new ConsoleMessage({
	"id": "1",
	"allowRepeating": true,
	"source": "javascript",
	"type": "log",
	"level": "error",
	"messageText": "1471047764458\tToolkit.GMP\tERROR\tGMPInstallManager.simpleCheckAndInstall Could not check for addons: Error: got node name: html, expected: updates (resource://gre/modules/addons/ProductAddonChecker.jsm:153:11) JS Stack trace: parseXML@ProductAddonChecker.jsm:153:11 < Async*ProductAddonChecker.getProductAddonList@ProductAddonChecker.jsm:320:12 < GMPInstallManager.prototype.checkForAddons@GMPInstallManager.jsm:107:5 < GMPInstallManager.prototype.simpleCheckAndInstall<@GMPInstallManager.jsm:204:29",
	"parameters": null,
	"repeat": 1,
	"repeatId": "{\"id\":null,\"allowRepeating\":true,\"source\":\"javascript\",\"type\":\"log\",\"level\":\"error\",\"messageText\":\"1471047764458\\tToolkit.GMP\\tERROR\\tGMPInstallManager.simpleCheckAndInstall Could not check for addons: Error: got node name: html, expected: updates (resource://gre/modules/addons/ProductAddonChecker.jsm:153:11) JS Stack trace: parseXML@ProductAddonChecker.jsm:153:11 < Async*ProductAddonChecker.getProductAddonList@ProductAddonChecker.jsm:320:12 < GMPInstallManager.prototype.checkForAddons@GMPInstallManager.jsm:107:5 < GMPInstallManager.prototype.simpleCheckAndInstall<@GMPInstallManager.jsm:204:29\",\"parameters\":null,\"repeatId\":null,\"stacktrace\":null,\"frame\":null}",
	"stacktrace": null,
	"frame": null
}));


// Temporarily hardcode these
stubConsoleMessages.set("ReferenceError", new ConsoleMessage({
  allowRepeating: true,
  source: MESSAGE_SOURCE.JAVASCRIPT,
  type: MESSAGE_TYPE.LOG,
  level: MESSAGE_LEVEL.ERROR,
  messageText: "ReferenceError: asdf is not defined",
  parameters: null,
  repeat: 1,
  repeatId: null,
}));

module.exports = stubConsoleMessages