import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-add-recipient-to-document",
  name: "Add Recipient To Document",
  description: "Add a recipient to an existing Documenso document. [See the documentation]([See the documentation](https://app.documenso.com/api/v1/openapi))",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    documenso,
    documentId: {
      propDefinition: [
        documenso,
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
    const response = await this.documenso.addRecipientToDocument({
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
