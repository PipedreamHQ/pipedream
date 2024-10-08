import pdfmonkey from "../../pdfmonkey.app.mjs";

export default {
  key: "pdfmonkey-generate-document",
  name: "Generate Document",
  description: "Generates a new document using a specified template. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdfmonkey,
    templateId: {
      propDefinition: [
        pdfmonkey,
        "templateId",
      ],
    },
    data: {
      propDefinition: [
        pdfmonkey,
        "data",
      ],
    },
    metadata: {
      propDefinition: [
        pdfmonkey,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdfmonkey.createDocument({
      templateId: this.templateId,
      data: this.data,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully generated document with ID ${response.document.id}`);
    return response;
  },
};
