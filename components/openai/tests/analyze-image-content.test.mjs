import assert from "node:assert/strict";
import test from "node:test";
import action from "../actions/analyze-image-content/analyze-image-content.mjs";
import listAction from "../actions/list-responses-model-id-options/list-responses-model-id-options.mjs";
import openai from "../openai.app.mjs";

function mockOpenAI(handler) {
  return {
    ...openai.methods,
    _makeRequest: handler,
  };
}

function runImageAction(modelId, output) {
  const openaiConnection = mockOpenAI((request) => {
    assert.equal(request.path, "/responses");
    assert.equal(request.method, "POST");
    assert.equal(request.data.model, modelId ?? "gpt-6-luna");
    assert.deepEqual(request.data.input[0].content, [
      {
        type: "input_text",
        text: "Describe the image",
      },
      {
        type: "input_image",
        file_id: "file-test",
        detail: "auto",
      },
    ]);
    return {
      output,
    };
  });
  return action.run.call({
    modelId,
    openai: openaiConnection,
    imageFileId: "file-test",
    imageDetailLevel: "auto",
    message: "Describe the image",
  }, {
    $: {
      export() {},
    },
  });
}

test("the image action defaults to Luna and finds text after a reasoning item", async () => {
  assert.equal(action.ai, "optimized");
  assert.equal(listAction.ai, "optimized");
  const text = {
    type: "output_text",
    text: "A small red square.",
  };
  assert.equal(action.props.modelId.propDefinition[0], openai);
  assert.equal(action.props.modelId.propDefinition[1], "responsesModelId");
  assert.equal(openai.propDefinitions.responsesModelId.default, "gpt-6-luna");
  const result = await runImageAction(undefined, [
    {
      type: "reasoning",
      summary: [],
    },
    {
      type: "message",
      role: "assistant",
      content: [
        text,
      ],
    },
  ]);
  assert.equal(result.response, text.text);
  assert.deepEqual(result.messages.at(-1), {
    role: "assistant",
    content: text,
  });
});

test("an existing model selection still goes to Responses unchanged", async () => {
  const result = await runImageAction("gpt-4o", [
    {
      type: "message",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: "A small red square.",
        },
      ],
    },
  ]);
  assert.equal(result.response, "A small red square.");
});

test("reasoning-only and refusal results do not manufacture response text", async () => {
  const reasoningOnly = await runImageAction(undefined, [
    {
      type: "reasoning",
      summary: [],
    },
  ]);
  assert.equal(reasoningOnly.response, undefined);
  assert.equal(reasoningOnly.messages.length, 1);

  const refusal = await runImageAction(undefined, [
    {
      type: "message",
      role: "assistant",
      content: [
        {
          type: "refusal",
          refusal: "I cannot describe that image.",
        },
      ],
    },
  ]);
  assert.equal(refusal.response, undefined);
  assert.equal(refusal.run.output[0].content[0].type, "refusal");
});

test("the action and its option-list companion both expose Luna when available", async () => {
  const context = {
    openai: mockOpenAI((request) => {
      assert.equal(request.path, "/models");
      return {
        data: [
          {
            id: "gpt-6-luna",
            created: 3,
          },
          {
            id: "gpt-4o",
            created: 2,
          },
          {
            id: "gpt-image-2",
            created: 1,
          },
        ],
      };
    }),
  };
  const expected = [
    "gpt-6-luna",
    "gpt-4o",
  ];
  const modelProp = openai.propDefinitions.responsesModelId;
  const options = await modelProp.options.call(context.openai);
  assert.deepEqual(options, expected);
  assert.deepEqual(await listAction.run.call(context, {
    $: {
      export() {},
    },
  }), expected);
  const chatProp = openai.propDefinitions.chatCompletionModelId;
  const chatOptions = await chatProp.options.call(context.openai);
  assert.deepEqual(chatOptions, [
    "gpt-4o",
  ]);
});
