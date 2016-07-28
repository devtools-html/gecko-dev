/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

const actions = require("devtools/client/webconsole/new-console-output/actions/filters");
const {
  FILTER_TOGGLE,
  FILTERS_CLEAR,
  MESSAGE_LEVEL
} = require("devtools/client/webconsole/new-console-output/constants");

const expect = require("expect");

describe("Filter actions:", () => {
  describe("filterToggle", () => {
    it("creates expected action", () => {
      const action = actions.filterToggle(MESSAGE_LEVEL.ERROR);
      const expected = {
        type: FILTER_TOGGLE,
        filter: "error"
      };

      expect(action).toEqual(expected);
    });
  });

  describe("filterTextApply", () => {

  });

  describe("filtersClear", () => {
    it("creates expected action", () => {
      const action = actions.filtersClear();
      const expected = {
        type: FILTERS_CLEAR
      };

      expect(action).toEqual(expected);
    });
  });
});
