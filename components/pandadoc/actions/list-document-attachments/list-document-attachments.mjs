import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-list-document-attachments",
  name: "List Document Attachment",
  description: "Returns a list of attachments associated with a specified document. [See the docs here](https://developers.pandadoc.com/reference/list-attachment)",
  type: "action",
  version: "0.0.6",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const { documentId } = this;

    const response = await this.app.listDocumentAttachments({
      $,
      documentId,
    });

    $.export("$summary", `Successfully fetched attachments of the document with ID: ${documentId}`);
    return response;
  },
};
