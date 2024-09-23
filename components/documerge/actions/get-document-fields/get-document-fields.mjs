import documerge from "../../documerge.app.mjs";

export default {
  key: "documerge-get-document-fields",
  name: "Get Document Fields",
  description: "Extracts and returns data from fields in a given document. [See the documentation](https://app.documerge.ai/api-docs/#documents-GETapi-documents-fields--document_id-)",
  version: "0.0.1",
  type: "action",
  props: {
    documerge,
    documentId: {
      propDefinition: [
        documerge,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.documerge.getDocumentFields({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully extracted field values from document with ID: ${this.documentId}`);
    return response;
  },
};
