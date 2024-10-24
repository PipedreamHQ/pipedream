import papersign from "../../papersign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-send-document",
  name: "Send Document",
  description: "Dispatches a document to a specified recipient. [See the documentation](https://paperform.readme.io/reference/papersignsenddocument)",
  version: "0.0.1",
  type: "action",
  props: {
    papersign,
    documentId: {
      propDefinition: [
        papersign,
        "documentId",
      ],
    },
    expiration: {
      type: "string",
      label: "Expiration",
      description: "The expiration date of the document. Must be at least 30 minutes in the future.",
      optional: true,
    },
    inviteMessage: {
      type: "string",
      label: "Invite Message",
      description: "The message to include in the invitation email, up to 1000 characters.",
      optional: true,
    },
    fromUserEmail: {
      type: "string",
      label: "From User Email",
      description: "The email address of a User on your team's account to send the document from.",
      optional: true,
    },
    documentRecipientEmails: {
      type: "string[]",
      label: "Document Recipient Emails",
      description: "An array of recipient emails for the document.",
      optional: true,
    },
    automaticReminders: {
      type: "object",
      label: "Automatic Reminders",
      description: "An object for setting automatic reminders.",
      optional: true,
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "An array of signer objects.",
      optional: true,
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "An array of variable objects.",
      optional: true,
    },
    copy: {
      type: "boolean",
      label: "Copy",
      description: "Whether to copy before sending.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.papersign.sendDocument({
      documentId: this.documentId,
      expiration: this.expiration,
      inviteMessage: this.inviteMessage,
      fromUserEmail: this.fromUserEmail,
      documentRecipientEmails: this.documentRecipientEmails,
      automaticReminders: this.automaticReminders,
      signers: this.signers,
      variables: this.variables,
      copy: this.copy,
    });
    $.export("$summary", `Document sent successfully with ID ${this.documentId}`);
    return response;
  },
};
