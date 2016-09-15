/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

// Test utils.
const expect = require("expect");
const { render } = require("enzyme");

// React
const { createFactory } = require("devtools/client/shared/vendor/react");

// Components under test.
const ConsoleApiCall = createFactory(require("devtools/client/webconsole/new-console-output/components/message-types/console-api-call").ConsoleApiCall);

// Test fakes.
const { stubPreparedMessages: stubs } = require("devtools/client/webconsole/new-console-output/test/fixtures/stubs/index");
const props = {
  onViewSourceInDebugger: () => {},
};
const tempfilePath = "http://example.com/browser/devtools/client/webconsole/new-console-output/test/fixtures/stub-generators/test-tempfile.js";

describe("ConsoleAPICall component:", () => {
  describe("console.log", () => {
    it("renders string grips", () => {
      const message = stubs.get("console.log('foobar', 'test')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("foobar test");
      expect(wrapper.find(".objectBox-string").length).toBe(2);
      expect(wrapper.find("div.message.cm-s-mozilla span span.message-flex-body span.message-body.devtools-monospace").length).toBe(1);
    });

    it("renders repeat node", () => {
      const message = stubs.get("console.log('foobar', 'test')").set("repeat", 107);
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-repeats").text()).toBe("107");

      expect(wrapper.find("span > span.message-flex-body > span.message-body.devtools-monospace + span.message-repeats").length).toBe(1);
    });
  });

  describe("console.count", () => {
    it("renders", () => {
      const message = stubs.get("console.count('bar')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("bar: 1");
    });
  });

  describe("console.assert", () => {
    it("renders", () => {
      const message = stubs.get("console.assert(false, {message: 'foobar'})");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("Assertion failed: Object { message: \"foobar\" }");
    });
  });

  describe("console.time", () => {
    it("does not show anything", () => {
      const message = stubs.get("console.time('bar')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("");
    });
  });

  describe("console.timeEnd", () => {
    it("renders as expected", () => {
      const message = stubs.get("console.timeEnd('bar')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe(message.messageText);
      expect(wrapper.find(".message-body").text()).toMatch(/^bar: \d+(\.\d+)?ms$/);
    });
  });

  describe("console.trace", () => {
    it("renders", () => {
      const message = stubs.get("console.trace()");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message, open: true })));
      const filepath = `${tempfilePath}?key=console.trace()`;

      expect(wrapper.find(".message-body").text()).toBe("console.trace()");

      const frameLinks = wrapper.find(`.stack-trace span.frame-link[data-url='${filepath}']`);
      expect(frameLinks.length).toBe(3);

      expect(frameLinks.eq(0).find(".frame-link-function-display-name").text()).toBe("testStacktraceFiltering");
      expect(frameLinks.eq(0).find(".frame-link-filename").text()).toBe(filepath);

      expect(frameLinks.eq(1).find(".frame-link-function-display-name").text()).toBe("foo");
      expect(frameLinks.eq(1).find(".frame-link-filename").text()).toBe(filepath);

      expect(frameLinks.eq(2).find(".frame-link-function-display-name").text()).toBe("triggerPacket");
      expect(frameLinks.eq(2).find(".frame-link-filename").text()).toBe(filepath);
    });
  });

  describe("console.log (handling tricky values)", () => {
    it("renders escaped values", () => {
      const message = stubs.get("console.log('hello \nfrom \rthe \"string world!')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text())
        .toBe("hello \\nfrom \\rthe \"string world!");
    });

    it("renders unicode values", () => {
      const message = stubs.get("console.log('\xFA\u1E47\u0129\xE7\xF6d\xEA \u021B\u0115\u0219\u0165')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("úṇĩçödê țĕșť");
    });

    // @TODO fill this in once https://github.com/devtools-html/gecko-dev/issues/277 is fixed.
    // const message = stubs.get("console.log(longString)");
    it("renders longString values");

    it("renders number 0", () => {
      const message = stubs.get("console.log(0)");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("0");
    });

    it("renders string '0'", () => {
      const message = stubs.get("console.log('0')");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      expect(wrapper.find(".message-body").text()).toBe("0");
    });

    it("renders a regex", () => {
      const message = stubs.get("console.log(/foobar/)");
      const wrapper = render(ConsoleApiCall(Object.assign({}, props, { message })));

      // Ensure that it is linked to variables view.
      expect(wrapper.find(".message-body .objectBox-regexp a.cm-variable").text())
        .toBe("/foobar/");
    });

    // @TODO add a test for Symbols when Bug 1303126 is complete
    it("renders a Symbol()");
  });
});
