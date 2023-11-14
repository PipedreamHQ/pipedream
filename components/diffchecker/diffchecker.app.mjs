import axios from "axios";

export default {
  type: "app",
  app: "diffchecker",
  propDefinitions: {
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Specifies the type of output you receive in the response body.",
      options: [
        "json",
        "html",
        "html_json",
      ],
    },
    diffLevel: {
      type: "string",
      label: "Diff Level",
      description: "Specifies whether you want to diff by word or character.",
      options: [
        "word",
        "character",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.diffchecker.com/public`;
    },
    _getHeaders(headers = {}) {
      if (this.$auth.api_key) {
        headers["X-Api-Key"] = this.$auth.api_key;
      }
      return headers;
    },
    _getParams(params) {
      return {
        ...params,
        email: `${this.$auth.email}`,
      };
    },
    async _makeRequest({
      path, form = false, params, headers, ...args
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._getHeaders(headers),
        ...args,
      };

      if (form) {
        config.url += `&email=${this.$auth.email}`;
      } else {
        config.params = this._getParams(params);
      }

      const { data } = await axios(config);
      return data;
    },
    async compareText(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/text",
        ...args,
      });
    },
    async comparePdfs({
      outputType, diffLevel = null, ...args
    }) {
      let path = `/pdf?output_type=${outputType}`;
      if (diffLevel) {
        path += `&diffLevel=${diffLevel}`;
      }
      return this._makeRequest({
        method: "POST",
        path,
        form: true,
        ...args,
      });
    },
    async compareImages({
      inputType, outputType, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/image?input_type=${inputType}&output_type=${outputType}`,
        form: true,
        ...args,
      });
    },
  },
};
