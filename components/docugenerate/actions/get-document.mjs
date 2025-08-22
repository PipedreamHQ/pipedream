import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-get-document",
  name: "Get Document",
  description: "Retrieves a specific document",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    documentId: {
      type: "string",
      label: "Document",
      description: "ID of the document",
    },
  },
  async run({ $ }) {
    const response = await this.app.getDocument($, this.documentId);
    
    $.export("$summary", `Successfully retrieved the document ${this.documentId}`);
    return response;
  },
};