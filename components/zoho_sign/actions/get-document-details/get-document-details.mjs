import zohoSign from "../../zoho_sign.app.mjs";

export default {
  key: "zoho_sign-get-document-details",
  name: "Get Document Details",
  description: "Get the details of a particular document. [See the documentation](https://www.zoho.com/sign/api/#get-details-of-a-particular-document)",
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
    const { requests } = await this.zohoSign.getDocumentDetails({
      documentId: this.documentId,
      $,
    });

    $.export("$summary", `Successfully retrieved details for document with ID ${this.documentId}`);

    return requests;
  },
};
