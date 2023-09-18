import { axios } from "@pipedream/platform";
import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-download-export",
  name: "Download Export",
  description: "Downloads an export from Gigasheet. [See the documentation](https://gigasheet.readme.io/reference/get_dataset-handle-download-export)",
  version: "0.0.1",
  type: "action",
  props: {
    gigasheet,
    datasetHandle: {
      type: "string",
      label: "Dataset Handle",
      description: "The handle of the dataset to download",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename for the download",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the download (csv, json, or xlsx)",
      optional: true,
      options: [
        "csv",
        "json",
        "xlsx",
      ],
    },
    compression: {
      type: "string",
      label: "Compression",
      description: "The compression of the download (gzip or zip)",
      optional: true,
      options: [
        "gzip",
        "zip",
      ],
    },
  },
  methods: {
    async downloadExport({
      $, ...params
    }) {
      return axios($, {
        url: `https://api.gigasheet.com/dataset/${params.datasetHandle}/download/export`,
        headers: {
          "X-GIGASHEET-TOKEN": `${this.gigasheet.$auth.api_key}`,
          "accept": "application/json",
        },
        params,
      });
    },
  },
  async run({ $ }) {
    const response = await this.downloadExport({
      $,
      datasetHandle: this.datasetHandle,
      filename: this.filename,
      format: this.format,
      compression: this.compression,
    });
    $.export("$summary", "Successfully downloaded export");
    return response;
  },
};
