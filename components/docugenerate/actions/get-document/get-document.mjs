import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-get-document",
  name: "Get Document",
  description: "Retrieves a specific document. [See the documentation](https://api.docugenerate.com/#/Document/getDocument)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    documentId: {
      type: "string",
      label: "Document",
      description: "The ID of the document",
    },
  },
  async run({ $ }) {
    const response = await this.app.getDocument($, this.documentId);

    $.export("$summary", `Successfully retrieved the document ${this.documentId}`);
    return response;
  },
};
