import assert from "node:assert/strict";
import test from "node:test";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const actionsRoot = new URL("../../actions/", import.meta.url);
const prompt = "a small red kite";
const imageUrl = "https://example.com/input.png";
const async = true;
const submissionCases = {
  "gpt-image-generate": {
    path: "/openai/images/generations",
    body: {
      model: "gpt-image-2",
      prompt,
      response_format: "url",
      async,
    },
  },
  "gpt-image-edit": {
    path: "/openai/images/edits",
    body: {
      model: "gpt-image-2",
      prompt,
      image: imageUrl,
      response_format: "url",
      async,
    },
  },
  "nano-banana-generate": {
    path: "/nano-banana/images",
    body: {
      action: "generate",
      model: "nano-banana-2-lite",
      prompt,
      aspect_ratio: "1:1",
      resolution: "1K",
      count: 1,
      async,
    },
  },
  "nano-banana-edit": {
    path: "/nano-banana/images",
    body: {
      action: "edit",
      model: "nano-banana-2-lite",
      prompt,
      image_urls: [
        imageUrl,
      ],
      count: 1,
      async,
    },
  },
  "flux-generate-image": {
    path: "/flux/images",
    body: {
      action: "generate",
      model: "flux-dev",
      prompt,
      size: "1024x1024",
      count: 1,
      async,
    },
  },
  "flux-edit-image": {
    path: "/flux/images",
    body: {
      action: "edit",
      model: "flux-kontext-pro",
      prompt,
      image_url: imageUrl,
      size: "1:1",
      count: 1,
      async,
    },
  },
  "flux-generate-video": {
    path: "/flux/videos",
    body: {
      action: "generate",
      mode: "t2v",
      model: "flux-3",
      prompt,
      async,
    },
  },
  "qwen-image-generate": {
    path: "/qwen-image/images",
    body: {
      model: "qwen-image-3.0",
      prompt,
      size: "1024*1024",
      n: 1,
      async,
    },
  },
  "fish-audio-synthesize": {
    path: "/fish/tts",
    body: {
      text: "Hello world",
      model: "s2-pro",
      format: "mp3",
      async,
    },
  },
  "suno-generate-music": {
    path: "/suno/audios",
    body: {
      action: "generate",
      model: "chirp-v6",
      prompt,
      custom: false,
      instrumental: true,
      async,
    },
  },
  "midjourney-imagine": {
    path: "/midjourney/imagine",
    body: {
      action: "generate",
      prompt,
      version: "8.2",
      mode: "fast",
      async,
    },
  },
  "veo-generate-video": {
    path: "/veo/videos",
    body: {
      action: "text2video",
      model: "veo31-fast",
      prompt,
      aspect_ratio: "16:9",
      async,
    },
  },
  "grok-generate-video": {
    path: "/grok/videos",
    body: {
      model: "grok-imagine-video-1.5-fast:reverse",
      prompt,
      resolution: "480p",
      duration: 6,
      async,
    },
  },
  "happyhorse-generate-video": {
    path: "/happyhorse/videos",
    body: {
      action: "generate",
      model: "happyhorse-1.0-t2v",
      prompt,
      resolution: "720P",
      duration: 3,
      ratio: "16:9",
      async,
    },
  },
  "wan-generate-video": {
    path: "/wan/videos",
    body: {
      action: "text2video",
      model: "wan2.6-t2v",
      prompt,
      duration: 5,
      resolution: "720P",
      async,
    },
  },
  "kling-generate-video": {
    path: "/kling/videos",
    body: {
      action: "text2video",
      model: "kling-v3-turbo",
      prompt,
      mode: "std",
      duration: 5,
      aspect_ratio: "16:9",
      async,
    },
  },
  "seedance-generate-video": {
    path: "/seedance/videos",
    body: {
      model: "doubao-seedance-2-0-mini-260615",
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
      resolution: "480p",
      ratio: "16:9",
      generate_audio: false,
      async,
    },
  },
  "minimax-generate-video": {
    path: "/minimax/videos",
    body: {
      model: "MiniMax-H3",
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
      resolution: "768P",
      duration: 4,
      ratio: "16:9",
      async,
    },
  },
  "seedream-decompose": {
    path: "/seedream/images",
    body: {
      model: "doubao-seedream-5-0-pro-260628",
      image: imageUrl,
      size: "auto",
      response_format: "url",
      layer_decomposition: true,
      async,
    },
  },
};

function output() {
  return {
    export() {},
  };
}

async function action(slug) {
  const path = join(actionsRoot.pathname, slug, `${slug}.mjs`);
  return (await import(pathToFileURL(path).href)).default;
}

function context(component, request) {
  const values = {
    prompt: "a small red kite",
    text: "Hello world",
    image: "https://example.com/input.png",
    imageUrl: "https://example.com/input.png",
    instrumental: true,
    query: "weather",
    type: "search",
    number: 3,
    page: 1,
    mode: 1,
  };
  for (const [
    key,
    prop,
  ] of Object.entries(component.props)) {
    if (key !== "acedatacloud" && values[key] === undefined && prop.default !== undefined) {
      values[key] = prop.default;
    }
  }
  return {
    ...values,
    acedatacloud: {
      request,
    },
  };
}

test("all new submissions send one async POST and return only submitted state", async () => {
  for (const [
    slug,
    spec,
  ] of Object.entries(submissionCases)) {
    const component = await action(slug);
    const calls = [];
    const result = await component.run.call(context(component, async (input) => {
      calls.push(input);
      return {
        task_id: "task-123",
      };
    }), {
      $: output(),
    });
    assert.equal(calls.length, 1, slug);
    assert.equal(calls[0].path, spec.path, slug);
    assert.deepEqual(calls[0].data, spec.body, slug);
    assert.equal(result.state, "submitted", slug);
    assert.equal(result.task_id, "task-123", slug);
  }
});

test("ambiguous submission failure does not replay a paid operation", async () => {
  for (const slug of Object.keys(submissionCases)) {
    const component = await action(slug);
    let calls = 0;
    await assert.rejects(component.run.call(context(component, async () => {
      calls += 1;
      throw Object.assign(new Error("upstream unavailable"), {
        response: {
          status: 503,
        },
      });
    }), {
      $: output(),
    }), /may have created a paid task/, slug);
    assert.equal(calls, 1, slug);
  }
});

test("edit actions reject hostless image URLs before a paid request", async () => {
  for (const slug of [
    "gpt-image-edit",
    "nano-banana-edit",
    "flux-edit-image",
    "seedream-decompose",
  ]) {
    const component = await action(slug);
    let calls = 0;
    const input = context(component, async () => {
      calls += 1;
      return {
        task_id: "task-123",
      };
    });
    input.image = "https://#fragment";
    input.imageUrl = "https://#fragment";
    await assert.rejects(component.run.call(input, {
      $: output(),
    }), /HTTP or HTTPS URL/, slug);
    assert.equal(calls, 0, slug);
  }
});

test("search and face actions use their synchronous contracts", async () => {
  for (const [
    slug,
    path,
  ] of [
      [
        "google-search",
        "/serp/google",
      ],
      [
        "face-keypoints",
        "/face/analyze",
      ],
    ]) {
    const component = await action(slug);
    const calls = [];
    const result = await component.run.call(context(component, async (input) => {
      calls.push(input);
      return {
        success: true,
        data: [],
      };
    }), {
      $: output(),
    });
    assert.equal(calls.length, 1, slug);
    assert.equal(calls[0].path, path, slug);
    assert.equal(calls[0].data.async, undefined, slug);
    assert.equal(result.success, true, slug);
  }
});

test("Fish Audio voice search returns one page for reference voice selection", async () => {
  const component = await action("search-fish-audio-voices");
  const calls = [];
  const input = context(component, async (request) => {
    calls.push(request);
    return {
      items: [
        {
          _id: "8d2c17a9b26d4d83888ea67a1ee565b2",
        },
      ],
      total: 1,
      has_more: false,
    };
  });
  input.title = "calm narrator";
  const result = await component.run.call(input, {
    $: output(),
  });
  assert.equal(component.annotations.readOnlyHint, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[0].path, "/fish/model");
  assert.equal(calls[0].data, undefined);
  assert.deepEqual(calls[0].params, {
    page_number: 1,
    page_size: 10,
    self: true,
    title: "calm narrator",
  });
  assert.equal(result.items[0]._id, "8d2c17a9b26d4d83888ea67a1ee565b2");
  input.pageSize = 0;
  await assert.rejects(component.run.call(input, {
    $: output(),
  }), /Page Size/);
  assert.equal(calls.length, 1);
});

test("every action key is unique and has a README", async () => {
  const folders = await readdir(actionsRoot, {
    withFileTypes: true,
  });
  const keys = new Set();
  for (const folder of folders.filter((entry) => entry.isDirectory())) {
    const slug = folder.name;
    if (slug === "common") continue;
    const component = await action(slug);
    assert.ok(!keys.has(component.key), component.key);
    keys.add(component.key);
    const files = await readdir(new URL(`${slug}/`, actionsRoot));
    assert.ok(files.includes("README.md"), slug);
  }
});
