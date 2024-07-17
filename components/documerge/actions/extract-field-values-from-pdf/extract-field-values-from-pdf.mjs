import { axios } from "@pipedream/platform";
import documerge from "../../documerge.app.mjs";

export default {
  key: "documerge-extract-field-values-from-pdf",
  name: "Extract Field Values from PDF",
  description: "Extracts and returns data from specified fields in a given pdf file.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documerge,
    pdfFileUrlOrId: {
      propDefinition: [
        documerge,
        "pdfFileUrlOrId",
      ],
    },
    fieldNames: {
      propDefinition: [
        documerge,
        "fieldNames",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.documerge._makeRequest({
      method: "POST",
      path: "/tools/pdf/split",
      data: {
        file: {
          url: this.pdfFileUrlOrId,
        },
        extract: this.fieldNames,
      },
    });
    $.export("$summary", `Successfully extracted field values from PDF file ${this.pdfFileUrlOrId}`);
    return response;
  },
};
