import app from "../../pdfless.app.mjs";

export default {
  name: "Create a PDF document",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      app,
      templateId,
      payload,
    } = this;

    const response = await app.generate({
      $,
      data: {
        template_id: templateId,
        payload,
      },
    });

    if (response?.status === "success") {
      $.export("$summary", "Successfully generated PDF");

    } else {
      $.export("$summary", "Failed to generate PDF");
    }

    return response;
  },
};
