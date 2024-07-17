import documerge from "../../documerge.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "documerge-convert-file-to-pdf",
  name: "Convert File to PDF",
  description: "Converts a specified file into a PDF. [See the documentation](https://app.documerge.ai/api-docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documerge,
    fileUrlOrId: {
      propDefinition: [
        documerge,
        "fileUrlOrId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.documerge.convertToPdf({
      data: {
        file: this.fileUrlOrId,
      },
    });
    $.export("$summary", "Successfully converted file to PDF");
    return response.data;
  },
};
