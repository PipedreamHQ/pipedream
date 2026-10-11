import assert from "node:assert/strict";
import test from "node:test";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const actionsRoot = new URL("../actions/", import.meta.url);
const submissionPaths = {
  "gpt-image-generate": "/openai/images/generations",
  "gpt-image-edit": "/openai/images/edits",
  "nano-banana-generate": "/nano-banana/images",
  "nano-banana-edit": "/nano-banana/images",
  "flux-generate-image": "/flux/images",
  "flux-edit-image": "/flux/images",
  "flux-generate-video": "/flux/videos",
  "qwen-image-generate": "/qwen-image/images",
  "fish-audio-synthesize": "/fish/tts",
  "suno-generate-music": "/suno/audios",
  "midjourney-imagine": "/midjourney/imagine",
  "veo-generate-video": "/veo/videos",
  "grok-generate-video": "/grok/videos",
  "happyhorse-generate-video": "/happyhorse/videos",
  "wan-generate-video": "/wan/videos",
  "kling-generate-video": "/kling/videos",
  "seedance-generate-video": "/seedance/videos",
  "minimax-generate-video": "/minimax/videos",
  "seedream-decompose": "/seedream/images",
};
const taskPaths = {
  "get-gpt-image-task": "/openai/tasks",
  "get-nano-banana-task": "/nano-banana/tasks",
  "get-flux-task": "/flux/tasks",
  "get-qwen-image-task": "/qwen-image/tasks",
  "get-fish-audio-task": "/fish/tasks",
  "get-suno-task": "/suno/tasks",
  "get-midjourney-task": "/midjourney/tasks",
  "get-veo-task": "/veo/tasks",
  "get-grok-task": "/grok/tasks",
  "get-happyhorse-task": "/happyhorse/tasks",
  "get-wan-task": "/wan/tasks",
  "get-kling-task": "/kling/tasks",
  "get-seedance-task": "/seedance/tasks",
  "get-minimax-task": "/minimax/tasks",
};

function output() {
  return { export() {} };
}

async function action(slug) {
  const path = join(actionsRoot.pathname, slug, `${slug}.mjs`);
  return (await import(pathToFileURL(path).href)).default;
}

function context(component, request) {
  const values = {
    model: "gpt-image-2",
    prompt: "a small red kite",
    text: "Hello world",
    image: "https://example.com/input.png",
    imageUrl: "https://example.com/input.png",
    size: "1024x1024",
    aspectRatio: "1:1",
    resolution: "1K",
    version: "8.2",
    instrumental: true,
    taskId: "task-123",
    query: "weather",
    type: "search",
    number: 3,
    page: 1,
    mode: 1,
  };
  for (const [key, prop] of Object.entries(component.props)) {
    if (key !== "acedatacloud" && values[key] === undefined && prop.default !== undefined) {
      values[key] = prop.default;
    }
  }
  return { ...values, acedatacloud: { request } };
}

test("all new submissions send one async POST and return only submitted state", async () => {
  for (const [slug, path] of Object.entries(submissionPaths)) {
    const component = await action(slug);
    const calls = [];
    const result = await component.run.call(context(component, async (input) => {
      calls.push(input);
      return { task_id: "task-123" };
    }), { $: output() });
    assert.equal(calls.length, 1, slug);
    assert.equal(calls[0].path, path, slug);
    assert.equal(calls[0].data.async, true, slug);
    assert.equal(result.state, "submitted", slug);
    assert.equal(result.task_id, "task-123", slug);
  }
});

test("ambiguous submission failure does not replay a paid operation", async () => {
  for (const slug of Object.keys(submissionPaths)) {
    const component = await action(slug);
    let calls = 0;
    await assert.rejects(component.run.call(context(component, async () => {
      calls += 1;
      throw Object.assign(new Error("upstream unavailable"), { response: { status: 503 } });
    }), { $: output() }), /may have created a paid task/, slug);
    assert.equal(calls, 1, slug);
  }
});

test("new task actions read the exact saved ID and never submit generation", async () => {
  for (const [slug, path] of Object.entries(taskPaths)) {
    const component = await action(slug);
    const calls = [];
    const result = await component.run.call(context(component, async (input) => {
      calls.push(input);
      return { id: "task-123", response: { success: true, data: [{ url: "https://example.com/result" }] } };
    }), { $: output() });
    assert.equal(calls.length, 1, slug);
    assert.equal(calls[0].path, path, slug);
    assert.deepEqual(calls[0].data, { action: "retrieve", id: "task-123" }, slug);
    assert.equal(result.state, "completed", slug);
  }
});

test("search and face actions use their synchronous contracts", async () => {
  for (const [slug, path] of [["google-search", "/serp/google"], ["face-keypoints", "/face/analyze"]]) {
    const component = await action(slug);
    const calls = [];
    const result = await component.run.call(context(component, async (input) => {
      calls.push(input);
      return { success: true, data: [] };
    }), { $: output() });
    assert.equal(calls.length, 1, slug);
    assert.equal(calls[0].path, path, slug);
    assert.equal(calls[0].data.async, undefined, slug);
    assert.equal(result.success, true, slug);
  }
});

test("every action key is unique and has a README", async () => {
  const folders = await readdir(actionsRoot, { withFileTypes: true });
  const keys = new Set();
  for (const folder of folders.filter((entry) => entry.isDirectory())) {
    const slug = folder.name;
    const component = await action(slug);
    assert.ok(!keys.has(component.key), component.key);
    keys.add(component.key);
    const files = await readdir(new URL(`${slug}/`, actionsRoot));
    assert.ok(files.includes("README.md"), slug);
  }
});
