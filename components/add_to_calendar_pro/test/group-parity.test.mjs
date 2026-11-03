import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("..", import.meta.url);

async function loadAction(path, app) {
  const context = vm.createContext({});
  const appModule = new vm.SyntheticModule(["default"], function () {
    this.setExport("default", app);
  }, { context });
  const utils = new vm.SourceTextModule(
    await readFile(new URL("common/utils.mjs", root), "utf8"),
    { context },
  );
  await utils.link(() => {
    throw new Error("utils has no imports");
  });
  await utils.evaluate();
  const source = await readFile(new URL(path, root), "utf8");
  const module = new vm.SourceTextModule(source, { context });
  await module.link((specifier) => specifier.endsWith("add_to_calendar_pro.app.mjs")
    ? appModule
    : utils);
  await module.evaluate();
  return module.namespace.default;
}

async function loadApp(axios) {
  const context = vm.createContext({ console });
  const platform = new vm.SyntheticModule(["axios"], function () {
    this.setExport("axios", axios);
  }, { context });
  const source = await readFile(new URL("add_to_calendar_pro.app.mjs", root), "utf8");
  const module = new vm.SourceTextModule(source, { context });
  await module.link(() => platform);
  await module.evaluate();
  return module.namespace.default;
}

const app = {
  propDefinitions: {},
  async createGroup(request) {
    this.request = request;
    return { status: "success" };
  },
  async updateGroup(request) {
    this.request = request;
    return { status: "success" };
  },
};

function runner(action, props) {
  return action.run.call({
    ...props,
    addToCalendarPro: app,
  }, { $: { export() {} } });
}

test("create maps children and preserves public overview values", async () => {
  const action = await loadAction("actions/create-event-group/create-event-group.mjs", app);
  assert.ok(action.props.subscription);
  assert.ok(action.props.publicEventOverview);

  await runner(action, {
    eventGroupName: "Synthetic",
    subscription: "children",
    publicEventOverview: true,
  });

  assert.deepEqual({ ...app.request.data }, {
    name: "Synthetic",
    subscription: "children",
    public_event_overview: true,
  });

  await runner(action, {
    eventGroupName: "Synthetic",
    subscription: "children",
    publicEventOverview: false,
  });
  assert.equal(app.request.data.public_event_overview, false);
});

test("create keeps the existing external URL behavior", async () => {
  const action = await loadAction("actions/create-event-group/create-event-group.mjs", app);
  await runner(action, {
    eventGroupName: "Synthetic",
    subscriptionCalUrl: "https://example.test/calendar.ics",
  });
  assert.equal(app.request.data.subscription, "external");
  assert.equal(app.request.data.subscription_cal_url, "https://example.test/calendar.ics");
});

test("update omits untouched fields but preserves false and empty values", async () => {
  const action = await loadAction("actions/update-event-group/update-event-group.mjs", app);
  assert.ok(action.props.subscription);
  assert.ok(action.props.publicEventOverview);

  await runner(action, {
    groupProKey: "group-key",
    publicEventOverview: false,
    internalNote: "",
  });

  assert.equal(app.request.groupProKey, "group-key");
  assert.deepEqual({ ...app.request.data }, {
    internal_note: "",
    public_event_overview: false,
  });
});

test("update maps supported children subscription fields", async () => {
  const action = await loadAction("actions/update-event-group/update-event-group.mjs", app);
  await runner(action, {
    groupProKey: "group-key",
    subscription: "children",
    publicEventOverview: true,
  });

  assert.equal(app.request.data.subscription, "children");
  assert.equal(app.request.data.public_event_overview, true);
  assert.equal(app.request.data.subscription_cal_url, undefined);
});

test("non-JSON 404 keeps the original HTTP error", async () => {
  const error = { status: 404, message: "not JSON" };
  const component = await loadApp(async () => {
    throw error;
  });
  const client = {
    $auth: { api_key: "synthetic" },
    _baseUrl: component.methods._baseUrl,
  };

  await assert.rejects(
    component.methods._makeRequest.call(client, { path: "/group/missing" }),
    (received) => received === error,
  );
});
