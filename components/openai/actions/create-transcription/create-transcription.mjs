import { getFileStreamAndMetadata } from "@pipedream/platform";
import openai from "../../openai.app.mjs";
import FormData from "form-data";
import { TRANSCRIPTION_MODELS } from "../../common/models.mjs";

export default {
  key: "openai-create-transcription",
  name: "Create Transcription",
  description: "Transcribes audio into the input language. [See the documentation](https://platform.openai.com/docs/api-reference/audio/createTranscription)",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    file: {
      propDefinition: [
        openai,
        "file",
      ],
    },
    model: {
      type: "string",
      label: "Model",
      description: "ID of the model to use",
      options: TRANSCRIPTION_MODELS,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Additional information to include in the transcription response. `logprobs` will return the log probabilities of the tokens in the response to understand the model's confidence in the transcription. `logprobs` only works with response_format set to `json` and only with the models `gpt-4o-transcribe` and `gpt-4o-mini-transcribe`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. en) format will improve accuracy and latency.",
      default: "en",
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "An optional text to guide the model's style or continue a previous audio segment. The [prompt](https://platform.openai.com/docs/guides/speech-to-text#prompting) should match the audio language.",
      optional: true,
    },
    response_format: {
      type: "string",
      label: "Response Format",
      description: "The format of the output. For `gpt-4o-transcribe` and `gpt-4o-mini-transcribe`, the only supported format is `json`.",
      options: [
        "json",
        "text",
        "srt",
        "verbose_json",
        "vtt",
      ],
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.",
      optional: true,
    },
    timestamp_granularities: {
      type: "string[]",
      label: "Timestamp Granularities",
      description: "The timestamp granularities to populate for this transcription. `response_format` must be set `verbose_json` to use timestamp granularities. Either or both of these options are supported: `word`, or `segment`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    createTranscription(opts = {}) {
      return this.openai._makeRequest({
        method: "POST",
        path: "/audio/transcriptions",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const {
      /* eslint-disable no-unused-vars */
      openai,
      file,
      createTranscription,
      ...fields
    } = this;

    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);

    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      const v = Array.isArray(value)
        ? value.join(",")
        : value;
      data.append(key, v);
    }

    const response = await createTranscription({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully converted speech to text");
    return response;
  },
};
