import { defineAction } from "@pipedream/types";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";
import { ConvertToPDFParams, ValidateEmailAddressParams } from "../../common/types";

export default defineAction({
  name: "Convert to PDF",
  description: `Convert Office Word Documents (docx) to PDF [See docs here](${DOCS.convertToPDF})`,
  key: "cloudmersive-convert-to-pdf",
  version: "0.0.1",
  type: "action",
  props: {
    cloudmersive,
    file: {
      type: "string",
      label: "File",
      description: "Input file (docx) to perform the operation on.",
    },
  },
  async run({ $ }) {
    const { file } = this;
    const params: ConvertToPDFParams = {
      $,
      file,
    };

    const response = await this.cloudmersive.convertToPDF(params);

    $.export("$summary", 'Converted file successfully');

    return response;
  },
});
