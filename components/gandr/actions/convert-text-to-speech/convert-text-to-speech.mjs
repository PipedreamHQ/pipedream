import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { ConfigurationError } from "@pipedream/platform";
import gandr from "../../gandr.app.mjs";

const MAX_INPUT_LENGTH = 2000;

export default {
  key: "gandr-convert-text-to-speech",
  name: "Convert Text to Speech",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Converts text into speech audio and saves the result to a file in the `/tmp` directory. Supports 23 languages, and every render is watermarked. [See the documentation](https://gandr.ai)",
  type: "action",
  props: {
    gandr,
    text: {
      type: "string",
      label: "Text",
      description: `The text that will get converted into speech. Maximum ${MAX_INPUT_LENGTH} characters per request.`,
    },
    voice: {
      propDefinition: [
        gandr,
        "voice",
      ],
      default: "gandr-mia",
    },
    responseFormat: {
      propDefinition: [
        gandr,
        "responseFormat",
      ],
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
      gandr,
      text,
      voice,
    } = this;

    if (text.length > MAX_INPUT_LENGTH) {
      throw new ConfigurationError(`Text is ${text.length} characters. The maximum is ${MAX_INPUT_LENGTH} characters per request. Split longer text into multiple requests.`);
    }

    const responseFormat = this.responseFormat || "mp3";

    const { data: response } = await gandr.createSpeech({
      $,
      data: {
        model: "tts-1",
        input: text,
        voice,
        response_format: responseFormat,
      },
    });

    const filePath = `/tmp/gandr-speech-${Date.now()}.${responseFormat}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(filePath));

    $.export("$summary", `Generated speech audio with voice ${voice} and saved it to ${filePath}`);
    return {
      filePath,
    };
  },
};
