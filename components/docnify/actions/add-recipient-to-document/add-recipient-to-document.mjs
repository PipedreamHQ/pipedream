import docnify from "../../docnify.app.mjs";

export default {
  key: "docnify-add-recipient-to-document",
  name: "Add Recipient To Document",
  description: "Add a recipient to an existing Docnify document. [See the documentation]([See the documentation](https://app.docnify.io/api/v1/openapi))",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docnify,
    documentId: {
      propDefinition: [
        docnify,
        "documentId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the recipient",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the recipient",
    },
  },
  async run({ $ }) {
    const response = await this.docnify.addRecipientToDocument({
      $,
      documentId: this.documentId,
      data: {
        name: this.name,
        email: this.email,
        role: "SIGNER",
      },
    });

    $.export("$summary", `Successfully added recipient to document ${this.documentId}`);
    return response;
  },
};
