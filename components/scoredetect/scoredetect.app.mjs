import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scoredetect",
  propDefinitions: {
    fileOrUrl: {
      type: "string",
      label: "File or URL",
      description: "Provide the file path for local files or the URL for remote files.",
      required: true,
    },
    textToCertify: {
      type: "string",
      label: "Text to Certify",
      description: "Provide the text to be certified.",
      required: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.scoredetect.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createCertificate({
      fileOrUrl, isUrl,
    }) {
      const formData = new FormData();
      if (isUrl) {
        const response = await axios({
          method: "get",
          url: fileOrUrl,
          responseType: "blob",
        });
        formData.append("file", response.data, "file");
      } else {
        formData.append("file", fileOrUrl);
      }
      return this._makeRequest({
        method: "POST",
        path: "/create-certificate",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    async generateChecksum({ textToCertify }) {
      const formData = new FormData();
      formData.append("text", textToCertify);
      return this._makeRequest({
        method: "POST",
        path: "/generate-checksum",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
  },
};
