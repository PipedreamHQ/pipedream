import assert from "node:assert/strict";
import test from "node:test";
import app from "../instant_reply.app.mjs";
import sendMessage from "../actions/send-message/send-message.mjs";
import sendCampaign from "../actions/send-campaign/send-campaign.mjs";
import triggerJourney from "../actions/trigger-journey/trigger-journey.mjs";

const runtime = () => ({ context: { id: "run-123" }, export() {} });

test("message send uses the public API contract and a stable retry key", async () => {
  const requests = [];
  const action = {
    ...sendMessage,
    instantReply: { sendMessage: async (request) => { requests.push(request); return { id: "message-1" }; } },
    conversationId: "conversation-1",
    content: "  Hello  ",
  };
  await action.run({ $: runtime() });
  await action.run({ $: runtime() });
  assert.equal(requests[0].conversationId, "conversation-1");
  assert.equal(requests[0].content, "Hello");
  assert.match(requests[0].idempotencyKey, /^ir-pd-[a-f0-9]{64}$/);
  assert.equal(requests[0].idempotencyKey, requests[1].idempotencyKey);
});

test("campaign creation targets an opted-in audience and can start the campaign", async () => {
  const requests = [];
  const action = {
    ...sendCampaign,
    instantReply: { _makeRequest: async (request) => {
      requests.push(request);
      return requests.length === 1 ? { id: "campaign-1", status: "draft" } : { id: "campaign-1", status: "running" };
    } },
    name: "Autumn sale",
    channel: "whatsapp",
    templateId: "00000000-0000-0000-0000-000000000001",
    contactTags: ["opted-in"],
    sendImmediately: true,
  };
  const response = await action.run({ $: runtime() });
  assert.equal(requests[0].path, "/campaigns");
  assert.equal(requests[0].data.channel, "whatsapp");
  assert.deepEqual(requests[0].data.audience, { tags: ["opted-in"] });
  assert.equal(requests[1].path, "/campaigns/campaign-1/send");
  assert.equal(response.status, "running");
});

test("campaign validation blocks missing consent targeting and WhatsApp template", async () => {
  const action = { ...sendCampaign, instantReply: { _makeRequest: () => { throw Error("unexpected request"); } }, name: "No audience", channel: "whatsapp", messageBody: "Hello" };
  await assert.rejects(action.run({ $: runtime() }), /audience tag/);
  action.contactTags = ["opted-in"];
  await assert.rejects(action.run({ $: runtime() }), /approved template ID/);
});

test("journey trigger uses either configured trigger name or journey ID", async () => {
  const requests = [];
  const action = {
    ...triggerJourney,
    instantReply: { _makeRequest: async (request) => { requests.push(request); return { data: { status: "enrolled" } }; } },
    phone: "+971500000000",
    triggerName: "new_signup",
  };
  await action.run({ $: runtime() });
  assert.equal(requests[0].path, "/trigger");
  assert.equal(requests[0].data.trigger_name, "new_signup");
  delete action.triggerName;
  await assert.rejects(action.run({ $: runtime() }), /Trigger Name or Journey ID/);
});

test("dynamic options follow the API cursor", async () => {
  const cursors = [];
  const instance = {
    ...app.methods,
    listContacts: async ({ params }) => {
      cursors.push(params.cursor);
      return params.cursor
        ? { data: [{ id: "contact-2" }], has_more: false }
        : { data: [{ id: "contact-1" }], has_more: true, next_cursor: "next" };
    },
  };
  const second = await instance._cursorPage("listContacts", 1);
  assert.deepEqual(cursors, [undefined, "next"]);
  assert.equal(second.data[0].id, "contact-2");
});
