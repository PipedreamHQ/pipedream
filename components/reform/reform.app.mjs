import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reform",
  propDefinitions: {
    document: {
      type: "string",
      label: "Document",
      description: "The path to a document file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "List of fields that you would like to extract as an array of objects. See the [documentation](https://docs.reformhq.com/synchronous-data-processing/extract) for information on how to specify fields.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.reformhq.com/v1/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    extractDataFromDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/extract",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...opts,
      });
    },
    extractDataFromText(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/extract-text",
        ...opts,
      });
    },
  },
};
