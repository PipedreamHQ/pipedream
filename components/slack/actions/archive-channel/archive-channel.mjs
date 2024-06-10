import slack from "../../slack.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "slack-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel. [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.18",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
            constants.CHANNEL_TYPE.MPIM,
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.sdk().conversations.archive({
      channel: this.conversation,
    });
    $.export("$summary", "Successfully archived channel.");
    return response;
  },
};
