import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "pdf4me",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a PDF file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "The filename to save the resulting PDF in the /tmp directory",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdf4me.com/api/v2";
    },
    async _makeRequest({
      $ = this,
      path = "/",
      ...otherOpts
    }) {
      try {
        return await axios($, {
          ...otherOpts,
          url: `${this._baseUrl()}${path}`,
          headers: {
            authorization: this.$auth.api_key,
          },
        });
      } catch (error) {
        utils.handleErrorMessage(error);
      }
    },
    convertToPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ConvertToPdf",
        ...opts,
      });
    },
    mergePdfs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Merge",
        ...opts,
      });
    },
    compressPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Optimize",
        ...opts,
      });
    },
  },
};
