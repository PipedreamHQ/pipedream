import slack from "../../slack.app.mjs";

export default {
  key: "slack-set-channel-topic",
  name: "Set Channel Topic",
  description: "Set the topic on a selected channel. [See the documentation](https://api.slack.com/methods/conversations.setTopic)",
  version: "0.0.20",
  type: "action",
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
    const response = await this.slack.sdk().conversations.setTopic({
      channel: this.conversation,
      topic: this.topic,
    });
    $.export("$summary", `Successfully set topic for channel with ID ${this.conversation}`);
    return response;
  },
};
