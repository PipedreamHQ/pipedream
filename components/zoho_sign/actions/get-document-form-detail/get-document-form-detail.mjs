import zohoSign from "../../zoho_sign.app.mjs";

export default {
  key: "zoho_sign-get-document-form-detail",
  name: "Get Document Form Detail",
  description: "Retrieves the filled field data for a particular document. [See the documentation](https://www.zoho.com/sign/api/#get-document-form-data)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoSign,
    documentId: {
      propDefinition: [
        zohoSign,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const { document_form_data: data } = await this.zohoSign.getDocumentFormDetail({
      documentId: this.documentId,
      $,
    });

    $.export("$summary", `Successfully retrieved form details for document with ID ${this.documentId}`);

    return data;
  },
};
