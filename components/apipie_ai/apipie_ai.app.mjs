import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "apipie_ai",
  propDefinitions: {
    chatCompletionModelId: {
      type: "string",
      label: "Completions Model",
      description: "The ID of the LLM model to use for completions.",
      async options() {
        const { data } = await this.listLlmModels();
        const uniqueModels = new Map();
        data.forEach(({ id, name }) => {
          if (!uniqueModels.has(id)) {
            uniqueModels.set(id, name);
          }
        });
        return Array.from(uniqueModels.entries())
          .map(([value, label]) => ({
            label,
            value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    },
    imageModelId: {
      type: "string",
      label: "Model",
      description: "The ID of the image model to use for completions.",
      async options() {
        const { data } = await this.listImageModels();
        const uniqueModels = new Map();
        data.forEach(({ id, name }) => {
          if (!uniqueModels.has(id)) {
            uniqueModels.set(id, name);
          }
        });
        return Array.from(uniqueModels.entries())
          .map(([value, label]) => ({
            label,
            value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    },
    ttsModelId: {
      type: "string",
      label: "Model",
      description: "The ID of the tts model to use for completions.",
      async options() {
        const { data } = await this.listTtsModels();
        const uniqueModels = new Map();
        data.forEach(({ id, name }) => {
          if (!uniqueModels.has(id)) {
            uniqueModels.set(id, name);
          }
        });
        return Array.from(uniqueModels.entries())
          .map(([value, label]) => ({
            label,
            value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens. **(range: [1, context_length))**.",
      min: 1,
      optional: true,
    },
    temperature: {
      type: "number",
      label: "Temperature",
      description: "Sampling temperature. **(range: [0, 2])**.",
      min: 0,
      max: 2,
      optional: true,
    },
    seed: {
      type: "number",
      label: "Seed",
      description: "Seed for deterministic outputs.",
      optional: true,
    },
    topP: {
      type: "number",
      label: "Top P",
      description: "Top-p sampling value. **(range: (0, 1])**.",
      min: 0,
      max: 1.0,
      optional: true,
    },
    topK: {
      type: "number",
      label: "Top K",
      description: "Top-k sampling value. **(range: [1, Infinity))**.",
      min: 1,
      optional: true,
    },
    frequencyPenalty: {
      type: "number",
      label: "Frequency Penalty",
      description: "Frequency penalty. **(range: [-2, 2])**.",
      min: -2.0,
      max: 2.0,
      optional: true,
    },
    presencePenalty: {
      type: "number",
      label: "Presence Penalty",
      description: "Presence penalty. **(range: [-2, 2])**.",
      min: -2.0,
      max: 2.0,
      optional: true,
    },
    repetitionPenalty: {
      type: "number",
      label: "Repetition Penalty",
      description: "Repetition penalty. **(range: (0, 2])**.",
      min: 0,
      max: 2.0,
      optional: true,
    },
    reasoningEffort: {
      type: "string",
      label: "Reasoning Effort",
      description: "OpenAI-style reasoning effort setting.",
      options: constants.EFFORT_OPTIONS,
      optional: true,
    },
    input: {
      type: "string",
      label: "Input",
      description: "The text to generate audio for. The maximum length is 4096 characters.",
    },
    audioResponseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to generate audio in. Supported formats are mp3, opus, aac, flac, wav, and pcm.",
      options: constants.AUDIO_RESPONSE_FORMATS,
      optional: true,
    },
    speed: {
      type: "number",
      label: "Speed",
      description: "The speed of the generated audio. Provide a value from 0.25 to 4.0.",
      default: 1,
      min: 0.25,
      max: 4.0,
      optional: true,
    },
    toolOutputs: {
      type: "string[]",
      label: "Tool Outputs",
      description: "The outputs from the tool calls. Each object in the array should contain properties `tool_call_id` and `output`.",
    },
    prompt: {
      label: "Prompt",
      description: "A text description of the desired image(s).",
      type: "string",
    },
    imageResponseFormat: {
      label: "Response Format",
      description: "The format in which the generated images are returned.",
      type: "string",
      optional: true,
      options: constants.IMAGE_RESPONSE_FORMATS,
      default: "url",
      reloadProps: true,
    },
    size: {
      label: "Size",
      description: "The size of the generated images.",
      type: "string",
      optional: true,
      options: constants.IMAGE_SIZES,
      default: "1024x1024",
    },
    n: {
      type: "integer",
      label: "N",
      description: "The number of images to generate. Must be between 1 and 10. not supported for all models.",
      optional: true,
      default: 1,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "The quality of the image",
      options: constants.IMAGE_QUALITIES,
      optional: true,
      default: "standard",
    },
    style: {
      type: "string",
      label: "Style",
      description: "The style of the image, not supported for all models.",
      options: constants.IMAGE_STYLES,
      optional: true,
      default: "natural",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://apipie.ai/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this._apiKey()}`,
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v1.0",
      };
    },
    _makeRequest({
      $, path, ...opts
    }) {
      $ = $ || this.$;
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listLlmModels() {
      return this._makeRequest({
        path: "models?type=llm",
      });
    },
    listImageModels() {
      return this._makeRequest({
        path: "models?type=image",
      });
    },
    listTtsModels() {
      return this._makeRequest({
        path: "models?subtype=text-to-speech",
      });
    },
    listVoices() {
      return this._makeRequest({
        path: "models?voices",
      });
    },
    sendChatCompletionRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "chat/completions",
        ...opts,
      });
    },
    createImage(args = {}) {
      return this._makeRequest({
        path: "images/generations",
        method: "POST",
        ...args,
      });
    },
    createSpeech(args = {}) {
      return this._makeRequest({
        path: "audio/speech",
        method: "POST",
        ...args,
      });
    },
  },
};
