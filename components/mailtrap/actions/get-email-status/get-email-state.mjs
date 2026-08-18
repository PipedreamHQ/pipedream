import app from "../../mailtrap.app.mjs";

export default {
  name: "Get Email State",
  description: "Retrieve delivery status, events, and metadata for an outbound transactional email [See the documentation](https://help.mailtrap.io/article/109-email-sending-api)",
  key: "mailtrap-get-email-state",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    sendingMessageId: {
      type: "string",
      label: "Sending Message ID",
      description: "The Message ID returned when the email was sent (e.g. from the `Send Email` action).",
    },
  },
  async run({ $ }) {
    const { sendingMessageId } = this;

    const response = await this.app.getEmailState({
      $,
      sendingMessageId,
    });

    $.export("$summary", `Retrieved state for email (ID: ${sendingMessageId})`);
    return response;
  },
};
