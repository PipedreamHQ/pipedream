import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-create-automation-order",
  name: "Create Automation Order",
  description: "Place an order for a webhook automation. May take up to 30 minutes to process. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Automation-management/operation/createAutomationOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    stadium,
    apiKey: {
      type: "string",
      label: "Automation API Key",
      description: "API key of the webhook automation (e.g., `ryfMiGzMp8ZTisWYbZUhjkVL`)",
      secret: true,
    },
    contactEmails: {
      type: "string[]",
      label: "Contact Emails",
      description: "Email addresses of recipients",
    },
    recipientMessage: {
      type: "string",
      label: "Recipient Message",
      description: "Message shown to the recipient at redemption. If not set, the message configured during automation setup will be used",
      optional: true,
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "Name of the sender. If not provided, the sender name configured during automation setup will be used",
      optional: true,
    },
    budget: {
      type: "integer",
      label: "Budget",
      description: "Amount of points to be gifted. If not provided, the points budget configured during automation setup will be used",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      contact_emails: this.contactEmails,
    };
    if (this.recipientMessage) data.recipient_message = this.recipientMessage;
    if (this.senderName) data.sender_name = this.senderName;
    if (this.budget) data.budget = this.budget;

    const response = await this.stadium.createAutomationOrder({
      $,
      apiKey: this.apiKey,
      data,
    });
    $.export("$summary", `Successfully created automation order — Identifier: ${response.identifier}`);
    return response;
  },
};
