import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-set-channel-topic",
  name: "Set Channel Topic",
  description: "Set the topic on a channel, specified by ID or by name — names are resolved automatically. [See the documentation](https://api.slack.com/methods/conversations.setTopic)",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    topic: {
      propDefinition: [
        slack,
        "topic",
      ],
    },
  },
  async run({ $ }) {
    // Accept a channel NAME as well as an ID. Slack answers a name here with a bare
    // `internal_error`, which tells an agent nothing about what it did wrong.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const response = await this.slack.setChannelTopic({
      channel,
      topic: this.topic,
    });
    $.export("$summary", `Successfully set topic for channel with ID ${channel}`);
    return response;
  },
};
