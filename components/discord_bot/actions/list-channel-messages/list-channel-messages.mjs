import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-list-channel-messages",
  name: "List Channel Messages",
  description: "Return the messages for a channel. [See the docs here](https://discord.com/developers/docs/resources/channel#get-channel-messages)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    limit: {
      description: "Max number of messages to return (1-100)",
      propDefinition: [
        discord,
        "limit",
      ],
    },
    after: {
      description: "Get messages after this message ID",
      propDefinition: [
        discord,
        "after",
      ],
    },
    before: {
      propDefinition: [
        discord,
        "before",
      ],
    },
    around: {
      propDefinition: [
        discord,
        "around",
      ],
    },
  },
  async run({ $ }) {
    return await this.discord.getMessages({
      $,
      channelId: this.channelId,
      after: this.after,
      limit: this.limit,
      around: this.around,
      before: this.before,
    });
  },
};
