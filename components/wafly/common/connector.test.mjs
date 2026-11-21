import test from "node:test";
import assert from "node:assert/strict";
import app from "../wafly.app.mjs";
import action from "../actions/send-text/send-text.mjs";
function client(auth = {
  instance_id: "fixture/id",
  instance_token: "FAKE_TOKEN",
  client_token: "FAKE_CLIENT",
}) { return {
  ...app.methods,
  $auth: auth,
}; }
let calls = [];
const mock = (status, body) => { calls = [];globalThis.fetch = async(url, opts) => {calls.push({
  url,
  opts,
});return {
  ok: status >= 200 && status < 300,
  status,
  json: async() => body,
};}; };
test("connection validation calls webhook only; preserves session", async() => { mock(200, {
  value: "",
});await client().validateInstanceCredentials();assert.equal(calls.length, 1);assert.ok(calls[0].url.endsWith("/webhook"));assert.equal(calls[0].opts.method, "GET");assert.equal(calls[0].opts.redirect, "error"); });
test("credentials are required before network", async() => {mock(200, {});await assert.rejects(() => client({}).validateInstanceCredentials(), /Configure/);assert.equal(calls.length, 0);});
test("instance path encoded and token sent in expected header", async() => {mock(200, {});await client().validateInstanceCredentials();assert.match(calls[0].url, /fixture%2Fid/);assert.equal(calls[0].opts.headers["Client-Token"], "FAKE_CLIENT");});
test("normalizes formatted recipient", async() => {mock(200, {
  messageId: "fixture-message",
});await client().sendText({
  phone: "+55 (11) 99999-9999",
  message: "fixture",
});assert.equal(JSON.parse(calls[0].opts.body).phone, "5511999999999");});
test("preserves group JID", async() => {mock(200, {
  messageId: "fixture-message",
});await client().sendText({
  phone: "120363000000000@g.us",
  message: "fixture",
});assert.equal(JSON.parse(calls[0].opts.body).phone, "120363000000000@g.us");});
test("empty message rejected locally", async() => {mock(200, {});await assert.rejects(() => client().sendText({
  phone: "5511999999999",
  message: " ",
}), /required/);assert.equal(calls.length, 0);});
test("HTTP error redacts URL, token and body", async() => {mock(401, {
  token: "FAKE_TOKEN",
});await assert.rejects(() => client().validateInstanceCredentials(), (e) => e.message === "Wafly returned HTTP 401.");});
test("network failure sanitized; no automatic send retry", async() => {calls = [];globalThis.fetch = async(url) => {calls.push(url);throw new Error(url);};await assert.rejects(() => client().sendText({
  phone: "5511999999999",
  message: "fixture",
}), (e) => !e.message.includes("FAKE_TOKEN"));assert.equal(calls.length, 1);});
test("no messageId is unconfirmed, not success", async() => {mock(200, {
  status: "ok",
});await assert.rejects(() => client().sendText({
  phone: "5511999999999",
  message: "fixture",
}), /unconfirmed/);});
test("other routes blocked before network", async() => {mock(200, {});await assert.rejects(() => client()._request({
  path: "/logout",
}), /Unsupported/);assert.equal(calls.length, 0);});
test("action summary does not claim delivery or include recipient", async() => {let summary;const result = await action.run.call({
  app: {
    sendText: async() => ({
      messageId: "fixture",
    }),
  },
  phone: "FAKE_PHONE",
  message: "fixture",
}, {
  $: {
    export: (_, v) => {summary = v;},
  },
});assert.equal(result.messageId, "fixture");assert.ok(!summary.includes("FAKE_PHONE"));assert.match(summary, /accepted/);});

test("preserves canonical Wafly group suffix", async () => {
  mock(200, {
    messageId: "fixture",
  });
  await client().sendText({
    phone: "120363000000000-group",
    message: "fixture",
  });
  assert.equal(JSON.parse(calls[0].opts.body).phone, "120363000000000-group");
});
test("preserves newsletter suffix", async () => {
  mock(200, {
    messageId: "fixture",
  });
  await client().sendText({
    phone: "120363000000000@newsletter",
    message: "fixture",
  });
  assert.equal(JSON.parse(calls[0].opts.body).phone, "120363000000000@newsletter");
});
test("rejects unexpected text in recipient instead of changing the destination", async () => {
  mock(200, {});
  await assert.rejects(() => client().sendText({
    phone: "wrong-5511999999999",
    message: "fixture",
  }), /required/);
  assert.equal(calls.length, 0);
});
test("an unrelated id field does not confirm a message", async () => {
  mock(200, {
    id: "unrelated-operation",
  });
  await assert.rejects(() => client().sendText({
    phone: "5511999999999",
    message: "fixture",
  }), /unconfirmed/);
});
test("invalid message identifier types and whitespace are unconfirmed", async () => {
  for (const messageId of [
    true,
    {},
    [],
    " ",
  ]) {
    mock(200, {
      messageId,
    });
    await assert.rejects(() => client().sendText({
      phone: "5511999999999",
      message: "fixture",
    }), /unconfirmed/);
    assert.equal(calls.length, 1);
  }
});
test("duplicate prevention is not a new API acceptance", async () => {
  mock(200, {
    messageId: "DUPLICATE_fixture",
  });
  await assert.rejects(() => client().sendText({
    phone: "5511999999999",
    message: "fixture",
  }), /blocked a duplicate/);
  assert.equal(calls.length, 1);
});

test("instance read does not claim account token verification", async () => {
  mock(200, {
    value: "",
  });
  assert.deepEqual(await client().validateInstanceCredentials(), {
    instance_credentials_valid: true,
    client_token_verified: false,
  });
});
