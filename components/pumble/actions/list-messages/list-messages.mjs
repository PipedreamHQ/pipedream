import pumble from "../../pumble.app.mjs";

export default {
  key: "pumble-list-messages",
  name: "List Messages",
  description: "List messages in a channel. [See the documentation](https://pumble.com/help/integrations/add-pumble-apps/api-keys-integration/#list-messages-in-a-channel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const { messages } = await this.pumble.listMessages({
      $,
      params: {
        channel: this.channel,
      },
    });
    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return messages;
  },
};
