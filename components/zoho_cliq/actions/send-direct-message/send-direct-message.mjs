import app from "../../zoho_cliq.app.mjs";

export default {
  name: "Send Direct Message",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_cliq-send-direct-message",
  description: "Send a direct message. [See documentation](https://www.zoho.com/cliq/help/restapi/v2/#Post_Message_User)",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "The user's email that will receive the message",
      type: "string",
    },
    text: {
      label: "Text",
      description: "The text message",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.sendDirectMessage({
      $,
      email: this.email,
      data: {
        text: this.text,
        sync_message: true,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent message with ID ${response.message_id}`);
    }

    return response;
  },
};
