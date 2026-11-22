import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import { Readable } from "node:stream";
import digital from "../../actions/digital-human-generate-video/digital-human-generate-video.mjs";
import dreamina from "../../actions/dreamina-generate-video/dreamina-generate-video.mjs";
import omni from "../../actions/omni-flash-generate-video/omni-flash-generate-video.mjs";
import maestro from "../../actions/maestro-generate-video/maestro-generate-video.mjs";
import speech from "../../actions/openai-synthesize-speech/openai-synthesize-speech.mjs";
import transcribe from "../../actions/openai-transcribe-audio/openai-transcribe-audio.mjs";
import embeddings from "../../actions/openai-create-embeddings/openai-create-embeddings.mjs";
import { publishedOperationModels } from "../chat.mjs";
import { requestOptions } from "../utils.mjs";
import { readTranscriptionFile } from "../audio.mjs";

const $ = {
  export() {},
};
const image = "https://example.com/portrait.png";
const video = "https://example.com/video.mp4";
const audio = "https://example.com/audio.wav";
async function invoke(action, props, response = {
  task_id: "fixture",
}) {
  const calls = [];
  const result = await action.run.call({
    ...props,
    acedatacloud: {
      async request(args) { calls.push(args); return response; },
    },
  }, {
    $,
  });
  assert.equal(calls.length, 1);
  return {
    result,
    request: calls[0],
  };
}
async function rejectsBeforeRequest(action, props, match) {
  let calls = 0;
  await assert.rejects(action.run.call({
    ...props,
    acedatacloud: {
      async request() { calls++; },
    },
  }, {
    $,
  }), match);
  assert.equal(calls, 0);
}

test("legacy null method APIs expose only their active declared POST model enums", () => {
  const api = {
    path: "/speech",
    method: null,
    stage: "Beta",
    definition: {
      paths: {
        "/speech": {
          post: {
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      model: {
                        enum: [
                          "speech-a",
                          "speech-b",
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  assert.deepEqual(publishedOperationModels({
    items: [
      api,
    ],
    count: 1,
  }, "/speech").map((x) => x.id), [
    "speech-a",
    "speech-b",
  ]);
  assert.throws(() => publishedOperationModels({
    items: [
      {
        ...api,
        stage: "Deprecated",
      },
    ],
    count: 1,
  }, "/speech"), /No active/);
  assert.throws(() => publishedOperationModels({
    items: [
      {
        ...api,
        method: "GET",
      },
    ],
    count: 1,
  }, "/speech"), /No active/);
  assert.throws(() => publishedOperationModels({
    items: [
      {
        ...api,
        definition: {},
      },
    ],
    count: 1,
  }, "/speech"), /No active/);
});

test("Digital Human uses exclusive media and audio/text modes without deprecated or invented fields", async () => {
  for (const props of [
    {
      imageUrl: image,
      audioUrl: audio,
    },
    {
      videoUrl: video,
      text: "Hello",
      voiceId: "saved-voice",
    },
  ]) {
    const { request } = await invoke(digital, props);
    assert.equal(request.path, "/digital-human/videos");
    assert.equal(request.data.async, true);
    for (const field of [
      "model",
      "engine",
      "resolution",
    ]) assert.equal(request.data[field], undefined);
  }
  await rejectsBeforeRequest(digital, {
    imageUrl: image,
    videoUrl: video,
    audioUrl: audio,
  }, /exactly one/);
  await rejectsBeforeRequest(digital, {
    imageUrl: image,
    text: "Hello",
  }, /Saved Voice/);
});

test("Dreamina and Omni Flash preserve typed native reference fields", async () => {
  const dream = await invoke(dreamina, {
    model: "omnihuman-1.5",
    imageUrl: image,
    audioUrl: audio,
    maskUrls: [
      image,
    ],
  });
  assert.deepEqual(dream.request.data.mask_url, [
    image,
  ]);
  const omniProps = {
    model: "omni-flash",
    prompt: "Animate",
    imageUrls: [
      image,
    ],
    videoUrl: video,
    resolution: "720p",
    aspectRatio: "16:9",
  };
  const flash = await invoke(omni, omniProps);
  assert.deepEqual(flash.request.data.video_urls, [
    video,
  ]);
  await rejectsBeforeRequest(omni, {
    ...omniProps,
    imageUrls: [],
  }, /requires at least one/);
});

test("Maestro submits its native always-async contract with one language and no async/model fields", async () => {
  const props = {
    prompt: "Explain trees",
    duration: 30,
    aspect: "9:16",
    language: "en",
    scenario: "auto",
  };
  const {
    request, result,
  } = await invoke(maestro, props);
  assert.deepEqual(request.data.langs, [
    "en",
  ]);
  assert.equal(request.data.async, undefined);
  assert.equal(request.data.model, undefined);
  assert.equal(result.state, "submitted");
  await rejectsBeforeRequest(maestro, {
    ...props,
    duration: 301,
  }, /5 to 300/);
  await rejectsBeforeRequest(maestro, {
    ...props,
    scenario: "captions",
  }, /requires source video/);
});

test("speech saves binary audio with the chosen extension and rejects traversal before a request", async () => {
  const props = {
    model: "tts-1",
    input: "Hello",
    voice: "alloy",
    responseFormat: "wav",
    speed: "1",
  };
  const {
    request, result,
  } = await invoke(speech, props, Buffer.from("fixture-wave"));
  try {
    assert.equal(request.responseType, "arraybuffer");
    assert.equal(request.data.async, undefined);
    assert.equal(request.data.model, "tts-1");
    assert.match(result.outputFilePath, /\.wav$/);
    assert.equal(await fs.readFile(result.outputFilePath, "utf8"), "fixture-wave");
  } finally { await fs.unlink(result.outputFilePath); }
  for (const outputName of [
    "../secret",
    "..\\secret",
    "/secret",
    ".",
    "bad\0name",
  ]) await rejectsBeforeRequest(speech, {
    ...props,
    outputName,
  }, /filename without folders/);
});

test("transcription uploads a bounded native multipart file and preserves the account bearer header", async () => {
  const directory = await fs.mkdtemp("/tmp/ace-transcription-test-");
  const file = `${directory}/fixture.wav`;
  await fs.writeFile(file, "fixture-audio");
  try {
    const {
      request, result,
    } = await invoke(transcribe, {
      model: "gpt-transcribe",
      file,
      language: "en",
      responseFormat: "json",
    }, {
      text: "Hello",
    });
    assert.equal(result.text, "Hello");
    assert.match(request.headers["content-type"], /^multipart\/form-data; boundary=/);
    const multipart = request.data.getBuffer().toString();
    assert.match(multipart, /name="model"\r\n\r\ngpt-transcribe/);
    assert.match(multipart, /fixture-audio/);
    assert.doesNotMatch(multipart, /name="async"/);
    const options = requestOptions({
      ...request,
      apiKey: "fixture-key",
      headers: {
        ...request.headers,
        AUTHORIZATION: "forged",
      },
    });
    assert.equal(options.headers.Authorization, "Bearer fixture-key");
    assert.equal(options.headers.authorization, undefined);
    assert.equal(options.headers["content-type"], request.headers["content-type"]);
  } finally { await fs.unlink(file); await fs.rmdir(directory); }
  await assert.rejects(readTranscriptionFile(Readable.from([
    "small",
  ]), {
    size: 26 * 1024 * 1024,
  }), /25 MB/);
  await assert.rejects(readTranscriptionFile(Readable.from([
    Buffer.alloc(25 * 1024 * 1024 + 1),
  ])), /25 MB/);
});

test("embeddings keeps native models, dimensions and long text without a fake character-token limit", async () => {
  for (const model of [
    "text-embedding-3-small",
    "text-embedding-3-large",
  ]) {
    const { request } = await invoke(embeddings, {
      model,
      input: [
        "x".repeat(9000),
      ],
      dimensions: 128,
      encodingFormat: "float",
    }, {
      data: [
        {
          embedding: [
            0.1,
          ],
        },
      ],
    });
    assert.equal(request.data.model, model);
    assert.equal(request.data.dimensions, 128);
    assert.equal(request.data.input[0].length, 9000);
    assert.equal(request.data.async, undefined);
  }
});
