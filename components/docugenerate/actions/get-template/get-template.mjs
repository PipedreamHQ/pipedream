import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-get-template",
  name: "Get Template",
  description: "Retrieves a specific template. [See the documentation](https://api.docugenerate.com/#/Template/getTemplate)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTemplate($, this.templateId);

    $.export("$summary", `Successfully retrieved the template ${this.templateId}`);
    return response;
  },
};
