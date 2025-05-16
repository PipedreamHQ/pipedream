import selzy from "../../selzy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "selzy-create-email-message",
  name: "Create Email Message",
  description: "Adds a new email message. [See the documentation](https://selzy.com/en/support/category/api/messages/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    selzy,
    senderName: {
      propDefinition: [
        selzy,
        "senderName",
      ],
    },
    senderEmail: {
      propDefinition: [
        selzy,
        "senderEmail",
      ],
    },
    subject: {
      propDefinition: [
        selzy,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        selzy,
        "body",
      ],
    },
    listId: {
      propDefinition: [
        selzy,
        "listId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The optional name for the email message",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Optional custom fields for the email message",
      optional: true,
    },
  },
  async run({ $ }) {
    const emailMessageData = {
      sender_name: this.senderName,
      sender_email: this.senderEmail,
      subject: this.subject,
      body: this.body,
      list_id: this.listId,
    };

    if (this.name) {
      emailMessageData.name = this.name;
    }

    if (this.customFields) {
      Object.assign(emailMessageData, this.customFields);
    }

    const response = await this.selzy.createEmailMessage(emailMessageData);

    $.export("$summary", `Email message created successfully with ID ${response.message_id}.`);
    return response;
  },
};
