import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "voxell_forge",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "Forge embedding model tier.",
      options: [
        {
          label: "Turbo - 1024 dimensions",
          value: "turbo",
        },
        {
          label: "Pro - 2560 dimensions",
          value: "pro",
        },
        {
          label: "Ultra 4K - 4096 dimensions",
          value: "ultra-4k",
        },
      ],
      default: "turbo",
    },
    inputType: {
      type: "string",
      label: "Input Type",
      description: "Use query for search queries and document for content being indexed.",
      options: [
        "document",
        "query",
      ],
      default: "document",
      optional: true,
    },
    dim: {
      type: "integer",
      label: "Dimensions",
      description: "Optional Matryoshka truncation dimension. Leave blank to use the model's native dimension.",
      optional: true,
      min: 1,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.voxell.ai/v1";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
      });
    },
    createEmbeddings({
      $,
      texts,
      model,
      dim,
      inputType,
    }) {
      const data = {
        texts,
        model,
      };
      if (dim) data.dim = dim;
      if (inputType) data.input_type = inputType;

      return this._makeRequest({
        $,
        method: "POST",
        path: "/embed",
        data,
      });
    },
  },
};
