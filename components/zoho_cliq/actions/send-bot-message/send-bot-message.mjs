import app from "../../zoho_cliq.app.mjs";

export default {
  name: "Send Bot Message",
  version: "0.0.1",
  key: "zoho_cliq-send-bot-message",
  description: "Send message to a bot. [See documentation](https://www.zoho.com/cliq/help/restapi/v2/#Post_Message_Bot)",
  type: "action",
  props: {
    app,
    botName: {
      label: "Bot Name",
      description: "The bot name",
      type: "string",
    },
    text: {
      label: "Text",
      description: "The text message",
      type: "string",
    },
    broadcast: {
      label: "Broadcast",
      description: "To broadcast message to all the bot subscribers.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendBotMessage({
      $,
      botName: this.botName,
      data: {
        text: this.text,
        broadcast: this.broadcast,
      },
    });

    $.export("$summary", `Successfully sent message to bot ${this.botName}`); // Empty response from Zoho Cliq

    return response;
  },
};
