import app from "../../mailtrap.app.mjs";

export default {
  name: "Get Email State",
  description:
    "Retrieve delivery status, events, and metadata for an outbound transactional email [See the documentation]" +
    "(https://docs.mailtrap.io/developers/email-sending/email-logs#get-api-email_logs-sending_message_id)",
  key: "mailtrap-get-email-state",
  version: "0.0.1",
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
      description:
        "The Message ID returned when the email was sent (e.g. from the **Send Email** action)," +
        " e.g. `bd1e78f0-9bdb-11f1-0040-f1e7b501f32a`.",
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
