/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

// Test utils.
const expect = require("expect");
const { render } = require("enzyme");
const { unbeautify } = require("devtools/client/webconsole/new-console-output/test/helpers");

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

  describe("console.trace", () => {
    it("renders", () => {
      const message = stubConsoleMessages.get("console.trace()");
      const wrapper = render(ConsoleApiCall({ message, onViewSourceInDebugger }));

      expect(wrapper.find(".message-body").text()).toBe("console.trace()");

      expect(wrapper.find(".stack-trace").html()).toBe(unbeautify(`
<span data-url="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js" class="frame-link">
  <span class="frame-link-function-display-name">bar</span>
  <span class="frame-link-source" title="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js">
    <span class="frame-link-filename">http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js</span>
  </span>
</span>
<span data-url="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js" class="frame-link">
  <span class="frame-link-function-display-name">foo</span>
  <span class="frame-link-source" title="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js">
    <span class="frame-link-filename">http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js</span>
  </span>
</span>
<span data-url="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js" class="frame-link">
  <span class="frame-link-function-display-name">triggerPacket</span>
  <span class="frame-link-source" title="http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js">
    <span class="frame-link-filename">http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js</span>
  </span>
</span>`));
    });
  });
});
