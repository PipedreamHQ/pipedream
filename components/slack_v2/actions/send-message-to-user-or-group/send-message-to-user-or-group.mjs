import common from "../common/send-message.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "slack_v2-send-message-to-user-or-group",
  name: "Send Message to User or Group",
  description: "Send a message to a user or group. [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack: common.props.slack,
    users: {
      propDefinition: [
        common.props.slack,
        "user",
      ],
      type: "string[]",
      label: "Users",
      description: "Select the user(s) to message",
      optional: true,
    },
    conversation: {
      propDefinition: [
        common.props.slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.MPIM,
          ],
        }),
      ],
      description: "Select the group to message",
      optional: true,
    },
    text: {
      propDefinition: [
        common.props.slack,
        "text",
      ],
    },
    mrkdwn: {
      propDefinition: [
        common.props.slack,
        "mrkdwn",
      ],
    },
    ...common.props,
    // eslint-disable-next-line pipedream/props-label
    as_user: {
      ...common.props.as_user,
      description: "Optionally pass `true` to post the message as the authenticated user, instead of as a bot. Defaults to `true`.",
      // Default to true since bots can't message users unless the "Messages"
      // tab is enabled, and can't message groups unless the bot is a member.
      default: true,
    },
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    addToChannel: {
      type: "boolean",
      ...common.props.addToChannel,
      disabled: true,
      hidden: true,
    },
  },
  methods: {
    ...common.methods,
    openConversation(args = {}) {
      return this.slack.makeRequest({
        method: "conversations.open",
        ...args,
      });
    },
    async getChannelId() {
      if (!this.conversation && !this.users?.length) {
        throw new ConfigurationError("Must select a group or user(s) to message");
      }

      if (this.conversation) {
        return this.conversation;
      }
      const { channel: { id } } = await this.openConversation({
        users: this.users.join(),
      });
      return id;
    },
  },
};
