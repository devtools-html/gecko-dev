/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

// Test utils.
const expect = require("expect");
const sinon = require("sinon");
const { render } = require("enzyme");

// React
const { createFactory } = require("devtools/client/shared/vendor/react");

// Components under test.
const ConsoleApiCall = createFactory(require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call").ConsoleApiCall);

// Test fakes.
const stubConsoleMessages = require("devtools/client/webconsole/new-console-output/test/fixtures/stubs/index");
const onViewSourceInDebugger = () => {};

describe("ConsoleAPICall component:", () => {
  describe("console.log", () => {
    it("renders string grips", () => {
      const message = stubConsoleMessages.get("console.log('foobar', 'test')");
      const wrapper = render(ConsoleApiCall({ message, onViewSourceInDebugger }));
      // @TODO this should be `foobar test`
      expect(wrapper.find(".message-body").text()).toBe("\"foobar\"\"test\"");

      expect(wrapper.find(".objectBox-string").length).toBe(2);

      expect(wrapper.find("div.message.cm-s-mozilla span span.message-flex-body span.message-body.devtools-monospace").length)
        .toBe(1);
    });
    it("renders repeat node", () => {
      const message =
        stubConsoleMessages.get("console.log('foobar', 'test')")
        .set("repeat", 107);
      const wrapper = render(ConsoleApiCall({ message, onViewSourceInDebugger }));

      expect(wrapper.find(".message-repeats").text()).toBe("107");

      expect(wrapper.find("span > span.message-flex-body > span.message-body.devtools-monospace + span.message-repeats").length)
        .toBe(1);
    });
  });

  describe("console.count", () => {
    it("renders", () => {
      const message = stubConsoleMessages.get("console.count('bar')");
      const wrapper = render(ConsoleApiCall({ message, onViewSourceInDebugger }));

      expect(wrapper.find(".message-body").text()).toBe("bar: 1");
    });
  });
});
