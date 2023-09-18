import axios from "@pipedream/platform";
import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-upload-data-from-url",
  name: "Upload Data From URL",
  description: "Uploads data from a URL to Gigasheet. [See the documentation](https://gigasheet.readme.io/reference/post_upload-url)",
  version: "0.0.1",
  type: "action",
  props: {
    gigasheet,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the file to upload",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the uploaded file",
      optional: true,
    },
    delimiter: {
      type: "string",
      label: "Delimiter",
      description: "The delimiter used in the uploaded file",
      optional: true,
    },
    hasHeader: {
      type: "boolean",
      label: "Has Header",
      description: "Whether the uploaded file has a header row",
      optional: true,
    },
  },
  methods: {
    async uploadData({
      $, url, name, delimiter, hasHeader,
    }) {
      return axios($, {
        method: "POST",
        url: "https://api.gigasheet.com/upload/url",
        headers: {
          "X-GIGASHEET-TOKEN": `${this.gigasheet.$auth.api_key}`,
          "accept": "application/json",
        },
        data: {
          url,
          name,
          delimiter,
          hasHeader,
        },
      });
    },
  },
  async run({ $ }) {
    const {
      url, name, delimiter, hasHeader,
    } = this;
    const response = await this.uploadData({
      $,
      url,
      name,
      delimiter,
      hasHeader,
    });
    $.export("$summary", "Data uploaded successfully");
    return response;
  },
};
