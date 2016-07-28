/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

// Require helper is necessary to load certain modules.
require("devtools/client/webconsole/new-console-output/test/requireHelper")();
const { render, shallow } = require("enzyme");

const { createFactory } = require("react-dev");

const FilterButton = createFactory(require("devtools/client/webconsole/new-console-output/components/filter-button").FilterButton);
const FilterBar = createFactory(require("devtools/client/webconsole/new-console-output/components/filter-bar").UnconnectedFilterBar);
const { getAllFilters } = require("devtools/client/webconsole/new-console-output/selectors/filters");
const { getAllUi } = require("devtools/client/webconsole/new-console-output/selectors/ui");
const {
  MESSAGES_CLEAR,
  MESSAGE_LEVEL
} = require("devtools/client/webconsole/new-console-output/constants");

const { setupStore } = require("devtools/client/webconsole/new-console-output/test/helpers");

const expect = require("expect");
const jsdom = require("mocha-jsdom");
const sinon = require("sinon");

describe("FilterBar component:", () => {
  jsdom();

  it("initial render", () => {
    const store = setupStore([]);

    const wrapper = render(FilterBar(getProps(store)));
    const toolbar = wrapper.find(
      ".devtools-toolbar.webconsole-filterbar-primary"
    );

    // Clear button
    expect(toolbar.children().eq(0).attr("class"))
      .toBe("devtools-button devtools-clear-icon");
    expect(toolbar.children().eq(0).attr("title")).toBe("Clear output");

    // Filter bar toggle
    expect(toolbar.children().eq(1).attr("class"))
      .toBe("devtools-button devtools-filter-icon");
    expect(toolbar.children().eq(1).attr("title")).toBe("Toggle filter bar");

    // Text filter
    expect(toolbar.children().eq(2).attr("class")).toBe("devtools-plain-input");
    expect(toolbar.children().eq(2).attr("placeholder")).toBe("Filter output");
    expect(toolbar.children().eq(2).attr("type")).toBe("search");
    expect(toolbar.children().eq(2).attr("value")).toBe("");
  });

  it("displays filter bar when button is clicked", () => {
    const store = setupStore([]);

    let wrapper = shallow(FilterBar(getProps(store)));
    wrapper.find(".devtools-filter-icon").simulate("click");

    expect(getAllUi(store.getState()).configFilterBarVisible).toBe(true);
    wrapper = shallow(FilterBar(getProps(store)));

    // Buttons are displayed
    const buttonProps = {
      active: true,
      dispatch: store.dispatch
    };
    const logButton = FilterButton(Object.assign({}, buttonProps,
      { label: "Logs", filterKey: MESSAGE_LEVEL.LOG }));
    const infoButton = FilterButton(Object.assign({}, buttonProps,
      { label: "Info", filterKey: MESSAGE_LEVEL.INFO }));
    const warnButton = FilterButton(Object.assign({}, buttonProps,
      { label: "Warnings", filterKey: MESSAGE_LEVEL.WARN }));
    const errorButton = FilterButton(Object.assign({}, buttonProps,
      { label: "Errors", filterKey: MESSAGE_LEVEL.ERROR }));
    expect(wrapper.contains([errorButton, warnButton, logButton, infoButton])).toBe(true);
  });

  it("fires MESSAGES_CLEAR action when clear button is clicked", () => {
    const store = setupStore([]);
    store.dispatch = sinon.spy();

    const wrapper = shallow(FilterBar(getProps(store)));
    wrapper.find(".devtools-clear-icon").simulate("click");
    const call = store.dispatch.getCall(0);
    expect(call.args[0]).toEqual({
      type: MESSAGES_CLEAR
    });
  });

  it("sets filter text when text is typed", () => {
    const store = setupStore([]);

    const wrapper = shallow(FilterBar(getProps(store)));
    wrapper.find(".devtools-plain-input").simulate("input", { target: { value: "a" } });
    expect(store.getState().filters.text).toBe("a");
  });
});

function getProps(store) {
  const { dispatch, getState } = store;
  return {
    dispatch,
    filter: getAllFilters(getState()),
    ui: getAllUi(getState())
  };
}
