import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-list-documents",
  name: "List Documents",
  description: "Retrieves a list of documents generated from a template. [See the documentation](https://api.docugenerate.com/#/Document/queryDocuments)",
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
    const response = await this.app.listDocuments($, this.templateId);

    $.export("$summary", `Successfully retrieved ${response?.length || 0} documents`);
    return response;
  },
};
