import assert from "node:assert/strict";
import test from "node:test";
import acedatacloud from "../../acedatacloud.app.mjs";
import chat from "../../actions/chat-with-model/chat-with-model.mjs";
import list from "../../actions/list-chat-models/list-chat-models.mjs";
import {
  chatModelOptions, publishedChatModels,
} from "../chat.mjs";
import { requestOptions } from "../utils.mjs";

const models = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    endpoints: [
      {
        protocol: "chat_completions",
        path: "/v1/chat/completions",
        base_url: "https://api.acedata.cloud/v1",
        auth: "bearer",
      },
    ],
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

test("native model choices use only the authenticated/public chat intersection across model families", async () => {
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
    "claude-example",
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
    {
      label: "claude-example",
      value: "claude-example",
    },
  ]);
  assert.deepEqual(chatModelOptions([
    ...actual,
    ...actual,
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
  assert.equal(calls[0].path, "/v1/chat/completions");
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

test("chat preserves user and system text, including indentation and final newlines", async () => {
  const {
    input, calls,
  } = fixture();
  input.model = " gpt-4o-mini ";
  input.prompt = "    indented code\n";
  input.systemPrompt = "  instruction\n";
  await chat.run.call(input, {
    $: output(),
  });
  assert.equal(calls[0].data.model, "gpt-4o-mini");
  assert.deepEqual(calls[0].data.messages, [
    {
      role: "system",
      content: input.systemPrompt,
    },
    {
      role: "user",
      content: input.prompt,
    },
  ]);
});

test("completion requests leave the execution deadline to the workflow", () => {
  const options = requestOptions({
    path: "/v1/chat/completions",
    apiKey: "fixture",
    data: {
      model: "fixture",
    },
  });
  assert.equal(options.timeout, undefined);
  assert.equal(options.headers.Authorization, "Bearer fixture");
  assert.equal(options.maxRedirects, 0);
});

test("invalid and stale models fail before a metered completion request", async () => {
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
  }), /no confirmed native response/);
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

test("Messages-only models use the declared protocol and an explicit output budget", async () => {
  const model = {
    id: "claude-sonnet-5-5",
    endpoints: [
      {
        protocol: "messages",
        path: "/v1/messages",
        base_url: "https://api.acedata.cloud",
        auth: "bearer",
      },
    ],
  };
  const native = {
    type: "message",
    model: model.id,
    content: [
      {
        type: "text",
        text: "Native answer",
      },
    ],
    usage: {
      input_tokens: 2,
      output_tokens: 3,
    },
  };
  const {
    calls, input,
  } = fixture(async () => native, [
    model,
  ]);
  input.model = model.id;
  input.systemPrompt = "Be concise";
  assert.deepEqual(await chat.run.call(input, {
    $: output(),
  }), native);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/v1/messages");
  assert.deepEqual(calls[0].data, {
    model: model.id,
    messages: [
      {
        role: "user",
        content: input.prompt,
      },
    ],
    system: "Be concise",
    stream: false,
    max_tokens: 4096,
  });
});

test("Responses-only models preserve the native response and reject pending state", async () => {
  const model = {
    id: "responses-model",
    endpoints: [
      {
        protocol: "responses",
        path: "/v1/responses",
        base_url: "https://api.acedata.cloud/v1",
        auth: "bearer",
      },
    ],
  };
  const native = {
    object: "response",
    status: "completed",
    output: [
      {
        type: "message",
        content: [
          {
            type: "output_text",
            text: "Answer",
          },
        ],
      },
    ],
  };
  const {
    calls, input,
  } = fixture(async () => native, [
    model,
  ]);
  input.model = model.id;
  input.maxTokens = 123;
  input.systemPrompt = "Be concise";
  assert.deepEqual(await chat.run.call(input, {
    $: output(),
  }), native);
  assert.equal(calls[0].path, "/v1/responses");
  assert.deepEqual(calls[0].data, {
    model: model.id,
    input: input.prompt,
    instructions: "Be concise",
    max_output_tokens: 123,
    stream: false,
  });
  const pending = fixture(async () => ({
    ...native,
    status: "queued",
  }), [
    model,
  ]);
  pending.input.model = model.id;
  await assert.rejects(chat.run.call(pending.input, {
    $: output(),
  }), /no confirmed/);
  assert.equal(pending.calls.length, 1);
});

test("unknown endpoint metadata never retargets the account credential", async () => {
  const invalid = {
    id: "example",
    endpoints: [
      {
        protocol: "messages",
        path: "/v1/messages",
        base_url: "https://other.example",
        auth: "bearer",
      },
    ],
  };
  const {
    calls, input,
  } = fixture(undefined, [
    invalid,
  ]);
  input.model = invalid.id;
  await assert.rejects(chat.run.call(input, {
    $: output(),
  }), /no supported published chat protocol/);
  assert.equal(calls.length, 0);
});
