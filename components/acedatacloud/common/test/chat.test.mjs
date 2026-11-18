import assert from "node:assert/strict";
import test from "node:test";
import acedatacloud from "../../acedatacloud.app.mjs";
import chat from "../../actions/chat-with-gpt-model/chat-with-gpt-model.mjs";
import list from "../../actions/list-chat-models/list-chat-models.mjs";
import {
  chatModelOptions, publishedChatModels,
} from "../chat.mjs";

const models = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
  },
];
const output = () => ({
  export() {},
});
const response = {
  id: "chat-example",
  model: "gpt-4o-mini",
  choices: [
    {
      message: {
        role: "assistant",
        content: "A short answer.",
      },
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 5,
    total_tokens: 15,
  },
};

function fixture(request = async () => response, available = models) {
  const calls = [];
  return {
    calls,
    input: {
      model: "gpt-4o-mini",
      prompt: "Summarize the release note.",
      acedatacloud: {
        async listChatModels() { return available; },
        async request(args) { calls.push(args); return request(args); },
      },
    },
  };
}

test("native model choices use only the authenticated/public GPT chat intersection", async () => {
  const actual = publishedChatModels({
    data: [
      {
        id: "gpt-4o-mini",
      },
      {
        id: "claude-example",
      },
      {
        id: "image-example",
      },
      {
        id: "not-published",
      },
    ],
  }, {
    data: [
      {
        ...models[0],
        type: "chat",
        service_prefix: "acedatacloud-openai",
      },
      {
        id: "claude-example",
        type: "chat",
        service_prefix: "acedatacloud-claude",
      },
      {
        id: "image-example",
        type: "image",
        service_prefix: "acedatacloud-openai",
      },
      {
        id: "not-authenticated",
        type: "chat",
        service_prefix: "acedatacloud-openai",
      },
    ],
  });
  assert.deepEqual(actual.map((model) => model.id), [
    "gpt-4o-mini",
  ]);
  assert.throws(() => publishedChatModels({}, {
    data: [],
  }), /invalid catalog/);
  const options = await acedatacloud.propDefinitions.chatModel.options.call({
    async listChatModels() { return actual; },
  });
  assert.deepEqual(options, [
    {
      label: "GPT-4o Mini",
      value: "gpt-4o-mini",
    },
  ]);
  assert.deepEqual(chatModelOptions([
    ...models,
    ...models,
  ]), options);
});

test("chat sends one selected-model text completion and preserves content plus usage", async () => {
  const {
    calls, input,
  } = fixture();
  input.systemPrompt = "Answer concisely.";
  input.maxTokens = 128;
  assert.deepEqual(await chat.run.call(input, {
    $: output(),
  }), response);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/openai/chat/completions");
  assert.deepEqual(calls[0].data, {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Answer concisely.",
      },
      {
        role: "user",
        content: "Summarize the release note.",
      },
    ],
    stream: false,
    max_tokens: 128,
  });
  assert.equal(calls[0].data.async, undefined);
});

test("invalid, stale and non-GPT models fail before a metered completion request", async () => {
  for (const override of [
    {
      model: "not-published",
    },
    {
      model: "",
    },
    {
      prompt: " ",
    },
    {
      maxTokens: 0,
    },
    {
      maxTokens: 1.5,
    },
  ]) {
    const {
      calls, input,
    } = fixture();
    await assert.rejects(chat.run.call({
      ...input,
      ...override,
    }, {
      $: output(),
    }));
    assert.equal(calls.length, 0);
  }
  const {
    calls, input,
  } = fixture(undefined, []);
  await assert.rejects(chat.run.call(input, {
    $: output(),
  }), /Refresh the Model options/);
  assert.equal(calls.length, 0);
});

test("chat keeps definite client errors and does not retry ambiguous/empty completions", async () => {
  const definite = Object.assign(new Error("service access denied"), {
    response: {
      status: 403,
    },
  });
  let f = fixture(async () => { throw definite; });
  await assert.rejects(chat.run.call(f.input, {
    $: output(),
  }), (error) => error === definite);
  assert.equal(f.calls.length, 1);
  for (const status of [
    408,
    500,
    undefined,
  ]) {
    f = fixture(async () => { throw Object.assign(new Error("connection failed"), {
      status,
    }); });
    await assert.rejects(chat.run.call(f.input, {
      $: output(),
    }), /may have incurred usage/);
    assert.equal(f.calls.length, 1);
  }
  f = fixture(async () => ({
    choices: [],
  }));
  await assert.rejects(chat.run.call(f.input, {
    $: output(),
  }), /no completion choices/);
  assert.equal(f.calls.length, 1);
});

test("model-list action returns native model records without a completion POST", async () => {
  const {
    calls, input,
  } = fixture();
  assert.equal(list.annotations.readOnlyHint, true);
  assert.deepEqual(await list.run.call(input, {
    $: output(),
  }), models);
  assert.equal(calls.length, 0);
});
