import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    completionModelId: {
      label: "Model",
      description: "The ID of the model to use for completions. **This action doesn't support the ChatGPT `turbo` models**. Use the **Chat** action for those, instead.",
      type: "string",
      async options() {
        return (await this.getCompletionModels({})).map((model) => model.id);
      },
      default: "text-davinci-003",
    },
    chatCompletionModelId: {
      label: "Model",
      description: "The ID of the model to use for chat completions",
      type: "string",
      async options() {
        return (await this.getChatCompletionModels({})).map((model) => model.id);
      },
      default: "gpt-3.5-turbo",
    },
    embeddingsModelId: {
      label: "Model",
      description: "The ID of the embeddings model to use. OpenAI recommends using `text-embedding-ada-002` for nearly all use cases: \"It's better, cheaper, and simpler to use. [Read the blog post announcement](https://openai.com/blog/new-and-improved-embedding-model)\".",
      type: "string",
      async options() {
        return (await this.getEmbeddingsModels({})).map((model) => model.id);
      },
      default: "text-embedding-ada-002",
    },
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
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v1.0",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...this._commonHeaders(),
        },
        maxBodyLength: Infinity,
        ...args,
      });
    },
    async models({ $ }) {
      const { data: models } = await this._makeRequest({
        $,
        path: "/models",
      });
      return models.sort((a, b) => a?.id.localeCompare(b?.id));
    },
    async getChatCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => model.id.match(/turbo|gpt/gi));
    },
    async getCompletionModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(?=.*\b(babbage|davinci|ada|curie)\b)(?!.*\b(whisper|turbo|edit|insert|search|embedding|similarity|001)\b).*$/gm)
        );
      });
    },
    async getEmbeddingsModels({ $ }) {
      const models = await this.models({
        $,
      });
      return models.filter((model) => {
        const { id } = model;
        return (
          id.match(/^(text-embedding-ada-002|.*-(davinci|curie|babbage|ada)-.*-001)$/gm)
        );
      });
    },
    async _makeCompletion({
      $, path, args,
    }) {
      const data = await this._makeRequest({
        $,
        path,
        method: "POST",
        data: args,
      });

      // For completions, return the text of the first choice at the top-level
      let generated_text;
      if (path === "/completions") {
        const { choices } = data;
        generated_text = choices?.[0]?.text;
      }
      // For chat completions, return the assistant message at the top-level
      let generated_message;
      if (path === "/chat/completions") {
        const { choices } = data;
        generated_message = choices?.[0]?.message;
      }

      return {
        generated_text,
        generated_message,
        ...data,
      };
    },
    async createCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/completions",
        args,
      });
    },
    async createChatCompletion({
      $, args,
    }) {
      return this._makeCompletion({
        $,
        path: "/chat/completions",
        args,
      });
    },
    async createImage({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/images/generations",
        data: args,
        method: "POST",
      });
    },
    async createEmbeddings({
      $, args,
    }) {
      return this._makeRequest({
        $,
        path: "/embeddings",
        data: args,
        method: "POST",
      });
    },
    async createTranscription({
      $, form,
    }) {
      return this._makeRequest({
        $,
        path: "/audio/transcriptions",
        method: "POST",
        headers: {
          ...this._commonHeaders(),
          "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
        },
        data: form,
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
      // file,
    }) {
      const form = new FormData();
      form.append("purpose", purpose);
      // form.append("file", fs.createReadStream(file));

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
