import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gptzero_detect_ai",
  propDefinitions: {
    files: {
      type: "string[]",
      label: "Files",
      description: "A list of files to analyze. Each file's document will be truncated to 50,000 characters.",
    },
    version: {
      type: "string",
      label: "Version",
      description: "Optionally, you can specify the desired version of the detector. Defaults to the latest version.",
      optional: true,
    },
    document: {
      type: "string",
      label: "Document",
      description: "The single document you want to analyze. The document will be truncated to 50,000 characters.",
    },
    multilingual: {
      type: "boolean",
      label: "Multilingual",
      description: "When this option is `true`, a special multilingual AI detection model will be used. Currently supported languages are French and Spanish.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gptzero.me";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async detectFiles({
      files, version, ...otherOpts
    }) {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      if (version) {
        formData.append("version", version);
      }
      return this._makeRequest({
        method: "POST",
        path: "/v2/predict/files",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        ...otherOpts,
      });
    },
    async detectText({
      document, version, multilingual, ...otherOpts
    }) {
      const data = {
        document,
        version,
        multilingual,
      };
      return this._makeRequest({
        method: "POST",
        path: "/v2/predict/text",
        headers: {
          "Content-Type": "application/json",
        },
        data,
        ...otherOpts,
      });
    },
  },
};
