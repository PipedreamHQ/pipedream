import { axios } from "@pipedream/platform";
import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-create-export",
  name: "Create Export",
  description: "Creates an export for a gigasheet dataset. [See the documentation](https://gigasheet.readme.io/reference/post_dataset-handle-export)",
  version: "0.0.1",
  type: "action",
  props: {
    gigasheet,
    datasetHandle: {
      type: "string",
      label: "Dataset Handle",
      description: "The handle of the dataset you want to export",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format you want to export the dataset to",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "The filter to apply to the dataset before exporting",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to include in the export",
      optional: true,
    },
    gzip: {
      type: "boolean",
      label: "Gzip",
      description: "Whether to gzip the export",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of rows to limit the export to",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of rows to offset the export by",
      optional: true,
    },
  },
  methods: {
    createExport({
      $, datasetHandle, format, filter, fields, gzip, limit, offset,
    }) {
      return axios($, {
        method: "POST",
        url: `https://api.gigasheet.com/dataset/${datasetHandle}/export`,
        headers: {
          "X-GIGASHEET-TOKEN": `${this.gigasheet.$auth.api_key}`,
          "accept": "application/json",
        },
        data: {
          format,
          filter,
          fields,
          gzip,
          limit,
          offset,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.createExport({
      $,
      datasetHandle: this.datasetHandle,
      format: this.format,
      filter: this.filter,
      fields: this.fields,
      gzip: this.gzip,
      limit: this.limit,
      offset: this.offset,
    });
    $.export("$summary", "Successfully created export");
    return response;
  },
};
