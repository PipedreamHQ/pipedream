import app from "../../pdfless.app.mjs";

export default {
  name: "Create a PDF document",
  version: "0.0.1",
  key: "pdfless-generate-pdf",
  description: "Create a PDF document based on selected template identifier and defined payload. [See the documentation](https://github.com/Pdfless/pdfless-js)",
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    payload: {
      type: "object",
      label: "Payload",
      description: "The data to be used in the template",
    },
  },
  async run({ $ }) {
    const result = await this.app.generate({
      templateId: this.templateId,
      payload: this.payload,
    });

    if (result?.status === "success") {
      $.export("$summary", "Successfully generated PDF");
    }
    return result;
  },
};
