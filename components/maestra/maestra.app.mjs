import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "maestra",
  propDefinitions: {
    operationType: {
      type: "string",
      label: "Operation Type",
      description: "The type of operation to perform with the file",
      options: [
        "transcription",
        "caption",
        "voiceover",
      ],
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to upload",
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to translate",
      async options() {
        const files = await this.listFiles();
        return Object.entries(files)
          .reduce((acc, [
            fileId,
            { fileName: label },
          ]) => {
            return [
              ...acc,
              {
                label,
                value: fileId,
              },
            ];
          }, []);
      },
    },
    targetLanguages: {
      type: "object",
      label: "Target Languages",
      description: "An object of target languages to translate the file to, e.g., `{ \"french\": true, \"spanish\": true }`",
    },
  },
  methods: {
    getUrl(path) {
      return `https://${this.$auth.base_url}/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        apiKey: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "/getFiles",
        ...args,
      });
    },
  },
};
