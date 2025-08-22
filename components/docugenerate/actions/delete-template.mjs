import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-delete-template",
  name: "Delete Template",
  description: "Deletes a specific template",
  version: "0.0.3",
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
    const response = await this.app.deleteTemplate($, this.templateId);
    
    $.export("$summary", `Successfully deleted the template ${this.templateId}`);
    return response;
  },
};