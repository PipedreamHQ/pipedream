import assert from "node:assert/strict";
import test from "node:test";
import acedatacloud, {
  apiError,
  taskState,
  validateImageRequest,
} from "../acedatacloud.app.mjs";
import generateImage from "../actions/generate-image/generate-image.mjs";
import editImage from "../actions/edit-image/edit-image.mjs";
import getImageTask from "../actions/get-image-task/get-image-task.mjs";

const model = "doubao-seedream-5-0-lite-260128";

function step() {
  const exports = {};
  return {
    exports,
    export(key, value) {
      exports[key] = value;
    },
  };
}

test("Generate Image sends one async submission and returns only submitted state", async () => {
  const calls = [];
  const context = {
    acedatacloud: {
      async submitImage(args) {
        calls.push(args);
        return {
          task_id: "image-task-1",
        };
      },
    },
    model,
    prompt: " a blue glass cube ",
    size: "2K",
  };
  const $ = step();
  const result = await generateImage.run.call(context, {
    $,
  });
  assert.deepEqual(result, {
    task_id: "image-task-1",
    state: "submitted",
  });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].data, {
    model,
    prompt: "a blue glass cube",
    size: "2K",
  });
  assert.match($.exports.$summary, /pending/);
});

test("Edit Image submits one URL and validates input before HTTP", async () => {
  const calls = [];
  const context = {
    acedatacloud: {
      async submitImage(args) {
        calls.push(args);
        return {
          task_id: "edit-task-1",
        };
      },
    },
    model,
    prompt: "make the cube green",
    image: "https://example.com/cube.png",
    size: "2K",
  };
  assert.equal((await editImage.run.call(context, {
    $: step(),
  })).state, "submitted");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].data.image, "https://example.com/cube.png");
  await assert.rejects(
    editImage.run.call({
      ...context,
      image: "file:///tmp/private.png",
    }, {
      $: step(),
    }),
    /HTTP or HTTPS/,
  );
  assert.equal(calls.length, 1);
});

test("Get Image Task reads the same ID and preserves the full terminal record", async () => {
  const calls = [];
  const record = {
    id: "image-task-1",
    response: {
      success: true,
      data: [
        {
          image_url: "https://example.com/result.png",
        },
        {
          error: {
            code: "blocked",
          },
        },
      ],
      usage: {
        generated_images: 1,
      },
      cost: {
        amount: "0.3",
        currency: "credits",
      },
    },
  };
  const context = {
    acedatacloud: {
      async getImageTask(args) {
        calls.push(args);
        return record;
      },
    },
    taskId: "image-task-1",
  };
  const result = await getImageTask.run.call(context, {
    $: step(),
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].taskId, "image-task-1");
  assert.deepEqual(result.response, record.response);
  assert.equal(result.state, "completed");
});

test("task status distinguishes missing, pending, failed, completed, and unknown", () => {
  assert.equal(taskState({}), "not_found");
  assert.equal(taskState({
    id: "one",
  }), "pending");
  assert.equal(taskState({
    id: "one",
    response: {
      success: false,
    },
  }), "failed");
  assert.equal(taskState({
    id: "one",
    response: {
      success: true,
      data: [],
    },
  }), "completed");
  assert.equal(taskState({
    id: "one",
    response: {
      status: "succeeded",
    },
  }), "unknown");
});

test("shared transport uses Bearer auth and separate paths without redirect replay", async () => {
  // Action behavior is exercised above. The app method contract is checked
  // independently so no paid endpoint is needed in unit tests.
  const code = acedatacloud.methods.submitImage.toString();
  assert.match(code, /\/seedream\/images/);
  assert.match(code, /async: true/);
  assert.match(acedatacloud.methods.getImageTask.toString(), /\/seedream\/tasks/);
  assert.match(acedatacloud.methods.request.toString(), /maxRedirects: 0/);
  assert.match(acedatacloud.methods.request.toString(), /Bearer/);
});

test("invalid model, size, prompt, and transport errors do not start a fallback job", () => {
  assert.throws(() => validateImageRequest({
    model: "unknown",
    prompt: "x",
    size: "2K",
  }), /supported/);
  assert.throws(() => validateImageRequest({
    model,
    prompt: " ",
    size: "2K",
  }), /Prompt/);
  assert.throws(() => validateImageRequest({
    model,
    prompt: "x",
    size: "1K",
  }), /unavailable/);
  const error = apiError({
    response: {
      status: 503,
    },
  }, true);
  assert.match(error.message, /may have created a paid task/);
  assert.doesNotMatch(error.message, /api_key|Bearer/);
});
