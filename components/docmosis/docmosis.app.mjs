import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docmosis",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to merge data with",
    },
    dataToMerge: {
      type: "object",
      label: "Data to Merge",
      description: "The data to be merged with the template",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The output format of the generated document",
      options: [
        {
          label: "PDF",
          value: "pdf",
        },
        {
          label: "DOC",
          value: "doc",
        },
        {
          label: "DOCX",
          value: "docx",
        },
        {
          label: "HTML",
          value: "html",
        },
      ],
      optional: true,
      default: "pdf",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://dws4.docmosis.com/services/rs/render";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "",
        headers,
        data,
        params,
        responseType = "arraybuffer",
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
        responseType,
      });
    },
    async generateDocument({
      templateId, dataToMerge, outputFormat,
    }) {
      const response = await this._makeRequest({
        data: {
          templateName: templateId,
          outputName: `output.${outputFormat || "pdf"}`,
          data: dataToMerge,
        },
      });
      const fs = require("fs");
      const path = require("path");
      const outputPath = path.join("/tmp", `generatedDocument.${outputFormat || "pdf"}`);
      fs.writeFileSync(outputPath, response);
      return outputPath;
    },
  },
  version: "0.0.{{ts}}",
};
