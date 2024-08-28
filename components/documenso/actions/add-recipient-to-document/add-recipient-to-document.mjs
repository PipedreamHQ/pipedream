import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-add-recipient-to-document",
  name: "Add Recipient To Document",
  description: "Add a recipient to an existing Documenso document",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documenso,
    documentId: {
      propDefinition: [
        documenso,
        "documentId",
      ],
    },
    recipientDetails: {
      propDefinition: [
        documenso,
        "recipientDetails",
      ],
    },
    message: {
      propDefinition: [
        documenso,
        "message",
      ],
      optional: true,
    },
    notificationSettings: {
      propDefinition: [
        documenso,
        "notificationSettings",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.documenso.addRecipientToDocument({
      documentId: this.documentId,
      recipientDetails: this.recipientDetails,
      message: this.message,
      notificationSettings: this.notificationSettings,
    });

    $.export("$summary", `Successfully added recipient to document ${this.documentId}`);
    return response;
  },
};
