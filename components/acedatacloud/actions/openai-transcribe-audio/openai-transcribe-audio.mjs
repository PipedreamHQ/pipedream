import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, meteredRequestError,
} from "../../common/utils.mjs";
import { chatModelOptions } from "../../common/chat.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import { readTranscriptionFile } from "../../common/audio.mjs";

export default {
  key: "acedatacloud-openai-transcribe-audio",
  name: "Transcribe OpenAI Audio",
  description: "Transcribe an audio file through Ace Data Cloud using a published speech recognition model. [See the documentation](https://platform.acedata.cloud/documents/openai-audio-transcriptions)",
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
      async options() { return chatModelOptions(await this.acedatacloud.listModelsForOperation("/v1/audio/transcriptions")); },
      "type": "string",
      "label": "Model",
      "description": "Published transcription model from the current API. Example: `whisper-1`.",
      "default": "whisper-1",
    },
    "file": {
      "type": "string",
      "label": "Audio File",
      "description": "A public file URL or /tmp file path, up to 25 MB. Supported audio: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm. Example: `/tmp/recording.wav`.",
    },
    "language": {
      "type": "string",
      "label": "Language",
      "description": "Optional ISO-639-1 language code such as en or zh. Omit for automatic recognition. Example: `en`.",
      "optional": true,
    },
    "prompt": {
      "propDefinition": [
        acedatacloud,
        "prompt",
      ],
      "label": "Prompt",
      "description": "Optional terminology or writing style guidance. Example: `A calm lake at sunrise`.",
      "optional": true,
    },
    "responseFormat": {
      "type": "string",
      "label": "Response Format",
      "description": "JSON or plain text; supported by both published transcription models. Example: `json`.",
      "options": [
        "json",
        "text",
      ],
      "default": "json",
    },
    "syncDir": {
      "type": "dir",
      "accessMode": "read",
      "sync": true,
      "optional": true,
    },
  },

  async run({ $ }) {
    const model = requiredText(this.model, "Model");
    const file = requiredText(this.file, "Audio File");
    if (![
      "json",
      "text",
    ].includes(this.responseFormat)) throw new Error("Choose JSON or text output.");
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    const audio = await readTranscriptionFile(stream, metadata);
    const data = new FormData();
    data.append("file", audio, {
      contentType: metadata.contentType,
      filename: metadata.name || "audio",
      knownLength: audio.length,
    });
    data.append("model", model);
    data.append("response_format", this.responseFormat);
    if (this.language) data.append("language", requiredText(this.language, "Language"));
    if (this.prompt) data.append("prompt", requiredText(this.prompt, "Prompt"));
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path: "/v1/audio/transcriptions",
        data,
        headers: data.getHeaders(),
        responseType: this.responseFormat,
      });
    } catch (error) { throw meteredRequestError(error, "Audio transcription"); }
    if (this.responseFormat === "text"
      ? typeof response !== "string"
      : typeof response?.text !== "string") throw new Error("Transcription returned no recognized response. Check usage before retrying.");
    $.export("$summary", "Transcribed audio");
    return response;

  },
};
