import assert from "node:assert/strict";
import test from "node:test";
import veo from "../../actions/veo-generate-video/veo-generate-video.mjs";
import kling from "../../actions/kling-generate-video/kling-generate-video.mjs";
import wan from "../../actions/wan-generate-video/wan-generate-video.mjs";
import happyhorse from "../../actions/happyhorse-generate-video/happyhorse-generate-video.mjs";
import seedance from "../../actions/seedance-generate-video/seedance-generate-video.mjs";

const first = "https://example.com/first.png";
const last = "https://example.com/last.png";
const video = "https://example.com/reference.mp4";
const audio = "https://example.com/reference.mp3";
const output = {
  export() {},
};

async function submit(action, props) {
  const calls = [];
  const context = {
    prompt: "A kite over a lake",
    ...props,
    acedatacloud: {
      async request(request) { calls.push(request); return {
        task_id: "fixture-task",
      }; },
    },
  };
  const result = await action.run.call(context, {
    $: output,
  });
  assert.equal(calls.length, 1);
  assert.equal(result.state, "submitted");
  assert.equal(calls[0].data.async, true);
  assert.equal(calls[0].data.model, props.model);
  return calls[0];
}

test("Veo exposes image frames and ingredients without substituting the selected model", async () => {
  const frames = await submit(veo, {
    model: "veo31",
    generationMode: "image2video",
    imageUrls: [
      first,
      last,
    ],
  });
  assert.equal(frames.data.action, "image2video");
  assert.deepEqual(frames.data.image_urls, [
    first,
    last,
  ]);
  const references = await submit(veo, {
    model: "veo31-fast-ingredients",
    generationMode: "ingredients2video",
    imageUrls: [
      first,
    ],
  });
  assert.equal(references.data.action, "ingredients2video");
});

test("Kling frame and Omni reference inputs retain their published field shapes", async () => {
  const frames = await submit(kling, {
    model: "kling-v2-6",
    generationMode: "image2video",
    qualityMode: "pro",
    firstFrameUrl: first,
    lastFrameUrl: last,
  });
  assert.equal(frames.data.start_image_url, first);
  assert.equal(frames.data.end_image_url, last);
  assert.equal(frames.data.mode, "pro");
  const omni = await submit(kling, {
    model: "kling-o1",
    generationMode: "image2video",
    referenceImageUrls: [
      first,
    ],
    referenceVideoUrl: video,
    prompt: "Use <<<image_1>>> in <<<video_1>>>",
  });
  assert.deepEqual(omni.data.image_list, [
    {
      image_url: first,
    },
  ]);
  assert.deepEqual(omni.data.video_list, [
    {
      video_url: video,
      refer_type: "base",
      keep_original_sound: "no",
    },
  ]);
  assert.equal(omni.data.generate_audio, false);
});

test("Wan i2v, r2v and Wan 3 media use the matching contract", async () => {
  const image = await submit(wan, {
    model: "wan2.6-i2v-flash",
    generationMode: "image2video",
    firstFrameUrl: first,
  });
  assert.equal(image.data.action, "image2video");
  assert.equal(image.data.image_url, first);
  const reference = await submit(wan, {
    model: "wan2.6-r2v",
    generationMode: "reference2video",
    referenceVideoUrls: [
      video,
    ],
  });
  assert.equal(reference.data.action, "text2video");
  assert.deepEqual(reference.data.reference_video_urls, [
    video,
  ]);
  const media = await submit(wan, {
    model: "wan3.0-video",
    generationMode: "reference2video",
    referenceImageUrls: [
      first,
    ],
    referenceVideoUrls: [
      video,
    ],
    referenceAudioUrls: [
      audio,
    ],
  });
  assert.deepEqual(media.data.media, [
    {
      type: "reference_image",
      url: first,
    },
    {
      type: "reference_video",
      url: video,
    },
    {
      type: "reference_audio",
      url: audio,
    },
  ]);
  assert.equal(media.data.action, undefined);
});

test("HappyHorse image, reference and video-edit models have their required native inputs", async () => {
  const image = await submit(happyhorse, {
    model: "happyhorse-1.1-i2v",
    generationMode: "image_to_video",
    firstFrameUrl: first,
  });
  assert.equal(image.data.image_url, first);
  const reference = await submit(happyhorse, {
    model: "happyhorse-1.0-r2v",
    generationMode: "reference_to_video",
    referenceImageUrls: [
      first,
      last,
    ],
  });
  assert.deepEqual(reference.data.image_urls, [
    first,
    last,
  ]);
  const edit = await submit(happyhorse, {
    model: "happyhorse-1.0-video-edit",
    generationMode: "video_edit",
    videoUrl: video,
    referenceImageUrls: [
      first,
    ],
  });
  assert.equal(edit.data.video_url, video);
  assert.equal(edit.data.action, "video_edit");
});

test("Seedance supports the Lite image model and native reference media", async () => {
  const image = await submit(seedance, {
    model: "doubao-seedance-1-0-lite-i2v-250428",
    firstFrameUrl: first,
  });
  assert.deepEqual(image.data.content[1], {
    type: "image_url",
    role: "first_frame",
    image_url: {
      url: first,
    },
  });
  const references = await submit(seedance, {
    model: "doubao-seedance-2-0-mini-260615",
    referenceImageUrls: [
      first,
    ],
    referenceVideoUrls: [
      video,
    ],
    referenceAudioUrls: [
      audio,
    ],
  });
  assert.deepEqual(references.data.content.slice(1).map((item) => item.role), [
    "reference_image",
    "reference_video",
    "reference_audio",
  ]);
  const audioOnly = await submit(seedance, {
    model: "doubao-seedance-2-5-260628",
    referenceAudioUrls: [
      audio,
    ],
    resolution: "1080p",
  });
  assert.equal(audioOnly.data.content[1].audio_url.url, audio);
  assert.equal(audioOnly.data.resolution, "1080p");
});

test("invalid modes or missing references fail before a metered request", async () => {
  const cases = [
    [
      veo,
      {
        model: "veo31-fast",
        generationMode: "ingredients2video",
        imageUrls: [
          first,
        ],
      },
    ],
    [
      veo,
      {
        model: "veo31-fast-ingredients",
        generationMode: "text2video",
      },
    ],
    [
      kling,
      {
        model: "kling-v2-6",
        generationMode: "image2video",
        firstFrameUrl: first,
        lastFrameUrl: last,
        qualityMode: "std",
      },
    ],
    [
      kling,
      {
        model: "kling-o1",
        generationMode: "image2video",
        referenceVideoUrl: video,
        generateAudio: true,
      },
    ],
    [
      wan,
      {
        model: "wan2.6-i2v",
      },
    ],
    [
      wan,
      {
        model: "wan2.6-r2v",
        generationMode: "reference2video",
      },
    ],
    [
      happyhorse,
      {
        model: "happyhorse-1.1-i2v",
        generationMode: "generate",
      },
    ],
    [
      happyhorse,
      {
        model: "happyhorse-1.0-video-edit",
        generationMode: "video_edit",
      },
    ],
    [
      seedance,
      {
        model: "doubao-seedance-1-0-lite-i2v-250428",
      },
    ],
    [
      seedance,
      {
        model: "doubao-seedance-2-0-260128",
        referenceAudioUrls: [
          audio,
        ],
      },
    ],
    [
      seedance,
      {
        model: "doubao-seedance-2-5-260628",
        firstFrameUrl: first,
        referenceVideoUrls: [
          video,
        ],
      },
    ],
  ];
  for (const [
    action,
    props,
  ] of cases) {
    let calls = 0;
    await assert.rejects(action.run.call({
      prompt: "A kite",
      ...props,
      acedatacloud: {
        async request() { calls++; },
      },
    }, {
      $: output,
    }));
    assert.equal(calls, 0);
  }
});
