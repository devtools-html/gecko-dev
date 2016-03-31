/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

var { utils: Cu } = Components;
var { require } = Cu.import("resource://devtools/shared/Loader.jsm", {});

var DevToolsUtils = require("devtools/shared/DevToolsUtils");
DevToolsUtils.testing = true;
DevToolsUtils.dumpn.wantLogging = true;
DevToolsUtils.dumpv.wantVerbose = false;
