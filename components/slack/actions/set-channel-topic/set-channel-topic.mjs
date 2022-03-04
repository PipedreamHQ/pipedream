import slack from "../../slack.app.mjs";

export default {
  key: "slack-set-channel-topic",
  name: "Set Channel Topic",
  description: "Set the topic on a selected channel",
  version: "0.0.2",
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
  async run() {
    return await this.slack.sdk().conversations.setTopic({
      channel: this.conversation,
      topic: this.topic,
    });
  },
};
