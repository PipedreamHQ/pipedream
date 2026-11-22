import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, meteredRequestError,
} from "../../common/utils.mjs";
import { chatModelOptions } from "../../common/chat.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export default {
  key: "acedatacloud-openai-synthesize-speech",
  name: "Synthesize OpenAI Speech",
  description: "Synthesize speech through Ace Data Cloud and save the audio file. [See the documentation](https://platform.acedata.cloud/documents/openai-audio-speech)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    "model": {
      async options() { return chatModelOptions(await this.acedatacloud.listModelsForOperation("/v1/audio/speech")); },
      "type": "string",
      "label": "Model",
      "description": "Published speech synthesis model from the current API. Example: `tts-1-hd`.",
      "default": "tts-1-hd",
    },
    "input": {
      "type": "string",
      "label": "Text",
      "description": "Text to synthesize. Example: `Hello from Ace Data Cloud`.",
    },
    "voice": {
      "type": "string",
      "label": "Voice",
      "description": "Published voice. Example: `alloy`.",
      "options": [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
      ],
      "default": "alloy",
    },
    "responseFormat": {
      "type": "string",
      "label": "Audio Format",
      "description": "Audio file encoding. Example: `mp3`.",
      "options": [
        "mp3",
        "opus",
        "aac",
        "flac",
        "wav",
        "pcm",
      ],
      "default": "mp3",
    },
    "speed": {
      "type": "string",
      "label": "Speed",
      "description": "Speech rate from 0.25 to 4. Example: `1`.",
      "default": "1",
    },
    "outputName": {
      "type": "string",
      "label": "Output Filename",
      "description": "Optional filename without folders or extension. A unique filename is generated if omitted. Example: `narration`.",
      "optional": true,
    },
    "syncDir": {
      "type": "dir",
      "accessMode": "write",
      "sync": true,
    },
  },

  async run({ $ }) {
    const format = this.responseFormat;
    if (![
      "mp3",
      "opus",
      "aac",
      "flac",
      "wav",
      "pcm",
    ].includes(format)) throw new Error("Choose a supported audio format.");
    if (![
      "alloy",
      "echo",
      "fable",
      "onyx",
      "nova",
      "shimmer",
    ].includes(this.voice)) throw new Error("Choose a published voice.");
    const speed = Number(this.speed);
    if (!Number.isFinite(speed) || speed < 0.25 || speed > 4) throw new Error("Speed must be between 0.25 and 4.");
    const name = this.outputName === undefined
      ? `ace-speech-${randomUUID()}`
      : requiredText(this.outputName, "Output Filename");
    if (name === "." || name === ".." || name.includes("/") || name.includes("\\") || name.includes("\0")) throw new Error("Output Filename must be a filename without folders.");
    const outputFilePath = path.join(process.env.STASH_DIR || "/tmp", `${name}.${format}`);
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path: "/v1/audio/speech",
        responseType: "arraybuffer",
        data: {
          model: requiredText(this.model, "Model"),
          input: requiredText(this.input, "Text"),
          voice: this.voice,
          response_format: format,
          speed,
        },
      });
    } catch (error) { throw meteredRequestError(error, "Speech synthesis"); }
    if (!(response instanceof ArrayBuffer) && !ArrayBuffer.isView(response)) throw new Error("Speech synthesis returned no audio bytes. Check usage before retrying.");
    const audio = Buffer.from(response);
    if (!audio.length) throw new Error("Speech synthesis returned empty audio. Check usage before retrying.");
    await fs.writeFile(outputFilePath, audio);
    $.export("$summary", "Saved synthesized speech audio");
    return {
      outputFilePath,
      bytes: audio.length,
      format,
    };

  },
};
