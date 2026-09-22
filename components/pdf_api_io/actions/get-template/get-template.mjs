import pdfApiIo from "../../pdf_api_io.app.mjs";

export default {
  key: "pdf_api_io-get-template",
  name: "Get Template",
  description: "Get a template by its ID. [See the documentation](https://pdf-api.io/en/docs/api/get-template)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pdfApiIo,
    templateId: {
      propDefinition: [
        pdfApiIo,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const template = await this.pdfApiIo.getTemplate({
      $,
      templateId: this.templateId,
    });
    $.export("$summary", `Successfully retrieved template with ID: ${this.templateId}`);
    return template;
  },
};
