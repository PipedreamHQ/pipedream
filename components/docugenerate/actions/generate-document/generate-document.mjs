import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-generate-document",
  name: "Generate Document",
  description: "Generates a document from a template. [See the documentation](https://api.docugenerate.com/#/Document/generateDocument)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the generated document. Defaults to the template’s name.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Output format of the generated document. Defaults to .docx.",
      optional: true,
      options: [
        {
          label: "PDF (.pdf)",
          value: ".pdf",
        },
        {
          label: "Microsoft Word (.docx)",
          value: ".docx",
        },
        {
          label: "Microsoft Word 2007 (.doc)",
          value: ".doc",
        },
        {
          label: "OpenDocument Format (.odt)",
          value: ".odt",
        },
        {
          label: "Plain Text (.txt)",
          value: ".txt",
        },
        {
          label: "PNG (.png)",
          value: ".png",
        },
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "Data that is used to generate the document.",
    },
  },
  async run({ $ }) {
    const body = {
      template_id: this.templateId,
      name: this.name,
      output_format: this.format,
      data: this.data,
    };

    const response = await this.app.generateDocument($, body);

    $.export("$summary", `Successfully generated the document ${response.id}`);
    return response;
  },
};
