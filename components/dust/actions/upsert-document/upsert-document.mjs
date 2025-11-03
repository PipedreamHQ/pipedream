import dust from "../../dust.app.mjs";

export default {
  key: "dust-upsert-document",
  name: "Upsert Document",
  description: "Upsert a document to a chosen Dust data source. [See the documentation](https://docs.dust.tt/reference/post_api-v1-w-wid-data-sources-name-documents-documentid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dust,
    dataSourceId: {
      propDefinition: [
        dust,
        "dataSourceId",
      ],
    },
    documentId: {
      type: "string",
      label: "Document Id",
      description: "An Id for the new document",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the document to upsert.",
    },
    lightDocumentOutput: {
      type: "boolean",
      label: "Light Document Output",
      description: "If true, a lightweight version of the document will be returned in the response (excluding the text, chunks and vectors). Defaults to false.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dust.upsertDocument({
      $,
      dataSourceId: this.dataSourceId,
      documentId: this.documentId,
      data: {
        text: this.content,
        light_document_output: this.lightDocumentOutput,
      },
    });

    $.export("$summary", "Successfully uploaded document");
    return response;
  },
};
