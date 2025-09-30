import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import papersign from "../../papersign.app.mjs";

export default {
  key: "papersign-send-document",
  name: "Send Document",
  description: "Dispatches a document to a specified recipient. [See the documentation](https://paperform.readme.io/reference/papersignsenddocument)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The expiration date of the document. Must be at least 30 minutes in the future. **Format: YYYY-MM-DDTHH:MM:SS.SSSZ**",
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
    firstAfterDays: {
      type: "integer",
      label: "Automatic Reminder - First After Days",
      description: "The number of days after the document is sent to send the reminder.",
      optional: true,
    },
    followUpEveryDays: {
      type: "integer",
      label: "Automatic Reminder - Follow Up Every Days",
      description: "The number of days to wait between reminders.",
      optional: true,
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "An array of objects of signers. **Object format: {\"key\": \"123\",\"name\": \"Jack Smith\",\"email\": \"signer@example.com\",\"phone\": \"123 456 7899\",\"job_title\": \"Account Manager\",\"company\": \"Explosive Startup\",\"custom_attributes\": [{\"key\": \"Relationship\",\"label\": \"Relationship to the company\",\"value\": \"CEO\"}]}**",
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The key: value of the document variables.",
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
    if (
      (this.firstAfterDays && !this.followUpEveryDays) ||
      (!this.firstAfterDays && this.followUpEveryDays)
    ) {
      throw new ConfigurationError("You must fill in the fields 'First After Days' and 'Follow Up Every Days' or none of them");
    }

    const automaticReminders = {};
    if (this.firstAfterDays) {
      automaticReminders.first_after_days = this.firstAfterDays;
      automaticReminders.follow_up_every_days = this.followUpEveryDays;
    }

    const variables = [];
    if (this.variables) {
      for (const key of Object.keys(parseObject(this.variables))) {
        variables.push({
          key,
          value: this.variables[key],
        });
      }
    }

    const response = await this.papersign.sendDocument({
      $,
      documentId: this.documentId,
      data: {
        expiration: this.expiration,
        inviteMessage: this.inviteMessage,
        fromUserEmail: this.fromUserEmail,
        documentRecipientEmails: parseObject(this.documentRecipientEmails),
        automaticReminders,
        signers: parseObject(this.signers),
        variables,
        copy: this.copy,
      },
    });
    $.export("$summary", `Document sent successfully with ID ${this.documentId}`);
    return response;
  },
};
