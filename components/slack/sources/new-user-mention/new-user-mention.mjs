import common from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack-new-user-mention",
  name: "New User Mention (Instant)",
  version: "0.0.8",
  description: "Emit new event when a username or specific keyword is mentioned in a channel",
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
        return this.conversations || [
          "message",
        ];
      },
    },
    user: {
      propDefinition: [
        common.props.slack,
        "user",
      ],
    },
    keyword: {
      propDefinition: [
        common.props.slack,
        "keyword",
      ],
      optional: true,
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New mention received";
    },
    async processEvent(event) {
      const {
        type: msgType,
        subtype,
        bot_id: botId,
        text,
        blocks = [],
      } = event;
      const [
        {
          elements: [
            { elements = [] } = {},
          ] = [],
        } = {},
      ] = blocks;

      if (msgType !== "message") {
        console.log(`Ignoring event with unexpected type "${msgType}"`);
        return;
      }

      // This source is designed to just emit an event for each new message received.
      // Due to inconsistencies with the shape of message_changed and message_deleted
      // events, we are ignoring them for now. If you want to handle these types of
      // events, feel free to change this code!!
      if (subtype && !constants.ALLOWED_SUBTYPES.includes(subtype)) {
        console.log(`Ignoring message with subtype. "${subtype}"`);
        return;
      }

      if ((this.ignoreBot) && (subtype === constants.SUBTYPE.BOT_MESSAGE || botId)) {
        return;
      }

      let emitEvent = false;
      if (elements) {
        let userMatch = false;
        for (const item of elements) {
          if (item.user_id && item.user_id === this.user) {
            userMatch = true;
            break;
          }
        }
        if (userMatch && (!this.keyword || text.indexOf(this.keyword) !== -1)) {
          emitEvent = true;
        }
      }
      if (subtype === constants.SUBTYPE.PD_HISTORY_MESSAGE) {
        emitEvent = true;
      }

      if (emitEvent) {
        return event;
      }
    },
  },
  sampleEmit,
};
