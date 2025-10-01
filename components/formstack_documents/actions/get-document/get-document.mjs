import formstackDocuments from "../../formstack_documents.app.mjs";

export default {
  key: "formstack_documents-get-document",
  name: "Get Document",
  description: "Get the details of the specified document. [See documentation](https://www.webmerge.me/developers?page=documents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    formstackDocuments,
    documentId: {
      propDefinition: [
        formstackDocuments,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.formstackDocuments.getDocument({
      documentId: this.documentId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved document with ID ${this.documentId}.`);
    }

    return response;
  },
};
