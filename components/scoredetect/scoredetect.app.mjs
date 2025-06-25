import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "scoredetect",
  propDefinitions: {
    fileOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
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
      file, metadata, ...args
    }) {
      const data = new FormData();
      if (metadata) {
        data.append("file", file, {
          contentType: metadata.contentType,
          knownLength: metadata.size,
          filename: metadata.name,
        });
      }
      else {
        data.append("file", file);
      }

      const headers = data.getHeaders();

      return this._makeRequest({
        method: "POST",
        url: "/create-certificate",
        headers,
        data,
        ...args,
      });
    },
  },
};
