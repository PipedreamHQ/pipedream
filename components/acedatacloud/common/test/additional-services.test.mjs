import assert from "node:assert/strict";
import test from "node:test";
import hailuo from "../../actions/hailuo-generate-video/hailuo-generate-video.mjs";
import luma from "../../actions/luma-generate-video/luma-generate-video.mjs";
import producer from "../../actions/producer-generate-music/producer-generate-music.mjs";
import music from "../../actions/acemusic-generate-song/acemusic-generate-song.mjs";

const image = "https://example.com/image.png";
const end = "https://example.com/end.png";

async function run(action, values) {
  const calls = [];
  const result = await action.run.call({
    ...values,
    acedatacloud: {
      async request(args) { calls.push(args); return {
        task_id: "fixture",
      }; },
    },
  }, {
    $: {
      export() {},
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].data.async, true);
  assert.equal(result.state, "submitted");
  return calls[0];
}

test("Hailuo text, image and director models use the declared first-image field", async () => {
  for (const model of [
    "minimax-t2v",
    "minimax-i2v",
    "minimax-i2v-director",
  ]) {
    const request = await run(hailuo, {
      model,
      prompt: "A river",
      ...(model !== "minimax-t2v" && {
        firstFrameUrl: image,
      }),
    });
    assert.equal(request.path, "/hailuo/videos");
    assert.equal(request.data.model, model);
    assert.equal(request.data.first_image_url, model === "minimax-t2v"
      ? undefined
      : image);
  }
  let calls = 0;
  await assert.rejects(hailuo.run.call({
    model: "minimax-i2v",
    prompt: "A river",
    acedatacloud: {
      async request() { calls++; },
    },
  }, {
    $: {
      export() {},
    },
  }), /first frame/);
  assert.equal(calls, 0);
});

test("Luma exposes frames and options without inventing a request model parameter", async () => {
  const request = await run(luma, {
    prompt: "A river",
    firstFrameUrl: image,
    lastFrameUrl: end,
    aspectRatio: "16:9",
    loop: true,
    enhancePrompt: false,
  });
  assert.equal(request.path, "/luma/videos");
  assert.deepEqual(request.data, {
    action: "generate",
    prompt: "A river",
    start_image_url: image,
    end_image_url: end,
    aspect_ratio: "16:9",
    loop: true,
    enhancement: false,
    async: true,
  });
  assert.equal(request.data.model, undefined);
});

test("Producer preserves each selected model and separates idea/custom lyric generation", async () => {
  for (const model of [
    "FUZZ-0.8",
    "FUZZ-1.0",
    "FUZZ-1.0 Pro",
    "FUZZ-1.1",
    "FUZZ-1.1 Pro",
    "FUZZ-2.0",
    "FUZZ-2.0 Pro",
    "FUZZ-2.0 Raw",
  ]) {
    const request = await run(producer, {
      model,
      prompt: "A spring song",
    });
    assert.equal(request.path, "/producer/audios");
    assert.equal(request.data.model, model);
    assert.equal(request.data.custom, false);
  }
  const custom = await run(producer, {
    model: "FUZZ-2.0",
    customLyrics: true,
    lyrics: "A new verse",
    title: "Spring",
  });
  assert.equal(custom.data.lyric, "A new verse");
  assert.equal(custom.data.prompt, undefined);
  assert.equal(custom.data.custom, true);
});

test("ACE Music generation accepts either public model without changing the selection", async () => {
  for (const model of [
    "acemusic-v1",
    "acemusic-v1.1",
  ]) {
    const request = await run(music, {
      model,
      prompt: "A spring song",
    });
    assert.equal(request.path, "/acemusic/audios");
    assert.equal(request.data.model, model);
  }
});
