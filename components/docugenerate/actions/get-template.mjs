import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-get-template",
  name: "Get Template",
  description: "Retrieves a specific template",
  version: "1.0.0",
  type: "action",
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