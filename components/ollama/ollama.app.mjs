import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ollama",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model Name",
      description: "Model names follow a `model:tag` format, where model can have an optional namespace such as `example/model`. Some examples are `orca-mini:3b-q4_1` and `llama3:70b`. The tag is optional and, if not provided, will default to latest. The tag is used to identify a specific version.",
      async options() {
        const { models } = await this.listLocalModels();
        return models.map(({ name }) => name);
      },
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to generate a response for.",
    },
    suffix: {
      type: "string",
      label: "Suffix",
      description: "The text after the model response.",
      optional: true,
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "A list of base64-encoded images (for multimodal models such as `llava`).",
      optional: true,
    },
    options: {
      type: "object",
      label: "Advanced Options",
      description: "Additional model parameters listed in the documentation for the [Modelfile](https://github.com/ollama/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values) such as `temperature`",
      optional: true,
    },
    insecure: {
      type: "boolean",
      label: "Insecure",
      description: "Allow insecure connections to the library. Only use this if you are pulling from your own library during development.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "If `false` the response will be returned as a single response object, rather than a stream of objects.",
      optional: true,
      default: false,
    },
    keepAlive: {
      type: "string",
      label: "Keep Alive",
      description: "Controls how long the model will stay loaded into memory following the request (default: 5m).",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.url}/api${path}`;
    },
    getHeaders(headers) {
      const { apiKey } = this.$auth;
      return {
        ...headers,
        ...(apiKey && {
          Authorization: `Bearer ${apiKey}`,
        }),
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listLocalModels(args = {}) {
      return this._makeRequest({
        path: "/tags",
        ...args,
      });
    },
  },
};
