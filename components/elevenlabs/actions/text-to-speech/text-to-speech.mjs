import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-text-to-speech",
  name: "Text To Speech",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve an audio file. [See the documentation](https://docs.elevenlabs.io/api-reference/text-to-speech)",
  type: "action",
  props: {
    elevenlabs,
    voiceId: {
      propDefinition: [
        elevenlabs,
        "voiceId",
      ],
    },
    modelId: {
      propDefinition: [
        elevenlabs,
        "modelId",
      ],
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text that will get converted into speech.",
    },
    similarityBoost: {
      type: "string",
      label: "Similarity Boost",
      description: "Low values are recommended if background artifacts are present in generated speech. High enhancement boosts overall voice clarity and target speaker similarity. Very high values can cause artifacts, so adjusting this setting to find the optimal value is encouraged. It goes from `0.0` to `1.0`.",
      optional: true,
    },
    stability: {
      type: "string",
      label: "Stability",
      description: "Decreasing stability can make speech more expressive with output varying between re-generations. It can also lead to instabilities. Increasing stability will make the voice more consistent between re-generations, but it can also make it sounds a bit monotone. On longer text fragments we recommend lowering this value. It goes from `0.0` to `1.0`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      elevenlabs,
      voiceId,
      modelId,
      text,
      similarityBoost,
      stability,
    } = this;

    const data = {
      model_id: modelId,
      text,
    };

    if (similarityBoost || stability) {
      data.voice_settings = {
        similarity_boost: similarityBoost,
        stability,
      };
    }

    const {
      data: response, headers,
    } = await elevenlabs.textToSpeech({
      $,
      voiceId,
      data,
    });

    const filePath = `/tmp/${headers["history-item-id"]}.mp3`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(filePath));

    $.export("$summary", `A speech with id: ${headers["history-item-id"]} was successfully generated!`);
    return {
      filePath,
    };
  },
};
