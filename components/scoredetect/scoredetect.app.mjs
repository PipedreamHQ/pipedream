import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "scoredetect",
  propDefinitions: {
    fileOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp). Alternatively, you can pass the direct URL to a file.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Provide the text to generate the certificate.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scoredetect.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createCertificate({
      file, ...args
    }) {
      const data = new FormData();
      data.append("file", file);

      const headers = data.getHeaders();

      return this._makeRequest({
        method: "POST",
        path: "/create-certificate",
        headers,
        data,
        ...args,
      });
    },
  },
};
