import assert from "node:assert/strict";
import test from "node:test";
import acedatacloud from "../acedatacloud.app.mjs";
import {
  apiError,
  normalizeImageInput,
  requestOptions,
  validateImageRequest,
} from "../common/utils.mjs";
import generateImage from "../actions/generate-image/generate-image.mjs";
import editImage from "../actions/edit-image/edit-image.mjs";

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
  assert.throws(() => normalizeImageInput("https://#fragment"), /HTTP or HTTPS/);
  await assert.rejects(
    editImage.run.call({
      ...context,
      image: "https://#fragment",
    }, {
      $: step(),
    }),
    /HTTP or HTTPS/,
  );
  assert.equal(calls.length, 1);
});

test("shared methods build a single paid submission", async () => {
  const calls = [];
  const app = {
    request(args) {
      calls.push(args);
      return {
        task_id: "one",
      };
    },
  };
  acedatacloud.methods.submitImage.call(app, {
    $: step(),
    data: {
      model,
      prompt: "cube",
      size: "2K",
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/seedream/images");
  assert.equal(calls[0].data.async, true);
  assert.equal(calls[0].data.response_format, "url");

  const config = requestOptions({
    apiKey: "synthetic-key",
    path: calls[0].path,
    data: calls[0].data,
  });
  assert.equal(config.url, "https://api.acedata.cloud/seedream/images");
  assert.equal(config.headers.Authorization, "Bearer synthetic-key");
  assert.equal(config.maxRedirects, 0);
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

test("submission preserves a definite 4xx API error and warns on ambiguous failure", async () => {
  const rejected = Object.assign(new Error("invalid model"), {
    response: {
      status: 400,
    },
  });
  assert.equal(apiError(rejected, true), rejected);
  assert.match(apiError({
    response: {
      status: 408,
    },
  }, true).message, /may have created a paid task/);
  assert.match(apiError(new Error("socket closed"), true).message, /may have created a paid task/);

  let calls = 0;
  const context = {
    acedatacloud: {
      async submitImage() {
        calls += 1;
        throw rejected;
      },
    },
    model,
    prompt: "cube",
    size: "2K",
  };
  await assert.rejects(generateImage.run.call(context, {
    $: step(),
  }), (error) => error === rejected);
  await assert.rejects(editImage.run.call({
    ...context,
    image: "https://example.com/cube.png",
  }, {
    $: step(),
  }), (error) => error === rejected);
  assert.equal(calls, 2);
});
