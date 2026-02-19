import slack from "../../slack_v2.app.mjs";

export default {
  key: "get-channel",
  name: "Get Channel Details",
  description: "Retrieve details for a Slack channel by selecting it or providing an ID. [See the documentation](https://api.slack.com/methods/conversations.info)",
  version: "0.0.1",
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
      optional: true,
    },

    channel_id: {
      type: "string",
      label: "Channel ID",
      description: "Provide a channel ID manually if not selecting above",
      optional: true,
    },
  },

  async run({ $ }) {
    const channelId = this.channel || this.channel_id;

    if (!channelId) {
      throw new Error("Please select a channel or provide a channel ID");
    }

    const response = await this.slack.conversationsInfo({
      channel: channelId,
      include_locale: true,
      include_num_members: true,
    });

    if (!response.ok) {
      throw new Error(response.error);
    }

    const channel = response.channel;

    $.export("$summary", `Fetched details for channel "${channel.name || channel.id}"`);

    return channel;
  },
};
