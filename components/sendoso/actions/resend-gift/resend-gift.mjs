import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-resend-gift",
  name: "Resend Gift",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Resend a gift to the recipient. [See the documentation](https://sendoso.docs.apiary.io/#reference/send-management)",
  type: "action",
  props: {
    sendoso,
    sendId: {
      propDefinition: [
        sendoso,
        "sendId",
      ],
      description: "The unique ID of the send to resend.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address to resend the gift to (optional, uses original if not provided).",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Optional updated message for the resend.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      sendId,
      email,
      customMessage,
    } = this;

    const data = {};
    if (email) data.email = email;
    if (customMessage) data.custom_message = customMessage;

    const response = await this.sendoso.resendGift({
      $,
      sendId,
      ...data,
    });

    $.export("$summary", `Successfully resent gift for send ID: ${sendId}`);
    return response;
  },
};

