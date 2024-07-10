import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack-new-reaction-added",
  name: "New Reaction Added (Instant)",
  version: "1.1.21",
  description: "Emit new event when a member has added an emoji reaction to a message",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    conversations: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
      type: "string[]",
      label: "Channels",
      description: "Select one or more channels to monitor for new messages.",
      optional: true,
    },
    // eslint-disable-next-line pipedream/props-description,pipedream/props-label
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        if (this.conversations?.length) {
          const conversations = [];
          for (const conversation of this.conversations) {
            conversations.push(`reaction_added:${conversation}`);
          }
          return conversations;
        }

        return [
          "reaction_added",
        ];
      },
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
    iconEmoji: {
      propDefinition: [
        common.props.slack,
        "icon_emoji",
      ],
      description: "Select one or more emojis to use as a filter. E.g. `fire, email`",
      type: "string[]",
      optional: true,
    },
    includeUserData: {
      label: "Include User Data",
      description: "Include user object in the response. Default `false`",
      type: "boolean",
      optional: true,
      default: false,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New reaction added";
    },
    async processEvent(event) {
      let iconEmojiParsed = [];

      try {
        iconEmojiParsed = typeof this.iconEmoji === "string" ?
          JSON.parse(this.iconEmoji) :
          this.iconEmoji;
      } catch (error) {
        iconEmojiParsed = this.iconEmoji.replace(/\s+/g, "").split(",");
      }

      if (
        ((this.ignoreBot) && (event.subtype == "bot_message" || event.bot_id)) ||
        (iconEmojiParsed?.length > 0 && !iconEmojiParsed.includes(event.reaction))
      ) {
        return;
      }

      if (this.includeUserData) {
        const userResponse = await this.slack.usersInfo({
          user: event.user,
        });
        const itemUserResponse = await this.slack.usersInfo({
          user: event.user,
        });

        event.userInfo = userResponse.user;
        event.itemUserInfo = itemUserResponse.user;
      }

      event.message = await this.getMessage({
        channel: event.item.channel,
        event_ts: event.item.ts,
      });

      return event;
    },
  },
  sampleEmit,
};
