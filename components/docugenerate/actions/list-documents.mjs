import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-list-documents",
  name: "List Documents",
  description: "Retrieves a list of documents generated from a template",
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
    const response = await this.app.listDocuments($, this.templateId);
    
    $.export("$summary", `Successfully retrieved ${response?.length || 0} documents`);
    return response;
  },
};