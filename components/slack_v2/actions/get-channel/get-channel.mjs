import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel",
  name: "Get Channel Details",
  description: "Retrieve details for a Slack channel by selecting it or providing an ID. [See the documentation](https://api.slack.com/methods/conversations.info)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },

  props: {
    slack,

    channel: {
      propDefinition: [
        slack,
        "conversation",
      ],
      description: "Select a channel or enter a channel ID manually.",
    },
  },

  async run({ $ }) {
    if (!this.channel) {
      throw new Error("Please select a channel or provide a channel ID");
    }

    const response = await this.slack.conversationsInfo({
      channel: this.channel,
      include_locale: true,
      include_num_members: true,
    });

    const channel = response.channel;

    $.export("$summary", `Fetched details for channel "${channel.name || channel.id}"`);

    return channel;
  },
};
