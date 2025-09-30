import pumble from "../../pumble.app.mjs";

export default {
  key: "pumble-send-message",
  name: "Send Message",
  description: "Send a message to a channel in Pumble. [See the documentation](https://pumble.com/help/integrations/add-pumble-apps/api-keys-integration/#send-messages)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pumble,
    channel: {
      propDefinition: [
        pumble,
        "channel",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The message to send",
    },
    asBot: {
      type: "boolean",
      label: "As Bot",
      description: "Whether to send the message from your personal account or as a bot. Defaults to `false`",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pumble.sendMessage({
      $,
      data: {
        channel: this.channel,
        text: this.text,
        asBot: this.asBot,
      },
    });
    $.export("$summary", `Successfully sent message with ID ${response.id}`);
    return response;
  },
};
