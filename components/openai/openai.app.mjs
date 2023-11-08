import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The intended purpose of the uploaded file. Use 'fine-tune' for fine-tuning and 'assistants' for assistants and messages.",
      options: [
        "fine-tune",
        "assistants",
      ],
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the text-to-speech conversion.",
      options: [
        "tts-1",
        "tts-1-hd",
        "gpt-3.5-turbo-1006",
        "babbage-002",
        "davinci-002",
        "gpt-4-0613",
      ],
    },
    input: {
      type: "string",
      label: "Input",
      description: "The text to generate audio for. The maximum length is 4096 characters.",
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer.",
      options: [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "The format to audio in. Supported formats are mp3, opus, aac, and flac.",
      options: [
        "mp3",
        "opus",
        "aac",
        "flac",
      ],
      optional: true,
    },
    speed: {
      type: "number",
      label: "Speed",
      description: "The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.",
      min: 0.25,
      max: 4.0,
      optional: true,
    },
    trainingFile: {
      type: "string",
      label: "Training File",
      description: "The reference to a file on `/tmp` that contains training data for fine-tuning.",
    },
    file: {
      type: "string",
      label: "File",
      description: "The reference to a file on `/tmp` to be uploaded.",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    _commonHeaders() {
      return {
        "Authorization": `Bearer ${this._apiKey()}`,
        "Content-Type": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v1.0",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...this._commonHeaders(),
        },
        method,
        ...args,
      });
    },
    async listFineTuningJobs({ after } = {}) {
      return this._makeRequest({
        path: "/fine_tuning/jobs",
        params: {
          after,
        },
      });
    },
    async listFiles({ purpose } = {}) {
      return this._makeRequest({
        path: "/files",
        params: {
          purpose,
        },
      });
    },
    async createFile({
      purpose,
      file,
    }) {
      const form = new FormData();
      form.append("purpose", purpose);
      form.append("file", fs.createReadStream(file));

      return this._makeRequest({
        path: "/files",
        method: "POST",
        headers: {
          ...this._commonHeaders(),
          "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
        },
        data: form,
      });
    },
    async createSpeech({
      model,
      input,
      voice,
      ...args
    }) {
      return this._makeRequest({
        path: "/audio/speech",
        method: "POST",
        data: {
          model,
          input,
          voice,
          ...args,
        },
      });
    },
  },
};
