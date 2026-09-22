import pdfApiIo from "../../pdf_api_io.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pdf_api_io-render-template",
  name: "Render Template",
  description: "Dynamically create a PDF document from a template. Returns a URL to the PDF document. [See the documentation](https://pdf-api.io/en/docs/api/render-pdf)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pdfApiIo,
    templateId: {
      propDefinition: [
        pdfApiIo,
        "templateId",
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "An object containing key-value pairs representing the data to be replaced in the template. The keys should match the placeholders you defined in the PDF template.",
    },
  },
  async run({ $ }) {
    const response = await this.pdfApiIo.renderTemplate({
      $,
      templateId: this.templateId,
      data: {
        data: parseObject(this.data),
        output: "url",
      },
    });
    $.export("$summary", `Successfully rendered template with ID: ${this.templateId}`);
    return response;
  },
};
