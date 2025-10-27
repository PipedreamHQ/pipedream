import common from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";
import sharedConstants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack_v2-new-keyword-mention",
  name: "New Keyword Mention (Instant)",
  version: "0.1.0",
  description: "Emit new event when a specific keyword is mentioned in a channel",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    conversations: {
      propDefinition: [
        common.props.slack,
        "conversation",
        () => ({
          types: [
            sharedConstants.CHANNEL_TYPE.PUBLIC,
            sharedConstants.CHANNEL_TYPE.PRIVATE,
          ],
        }),
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
    keyword: {
      propDefinition: [
        common.props.slack,
        "keyword",
      ],
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
      return "New keyword mention received";
    },
    async processEvent(event) {
      const {
        type: msgType,
        subtype,
        bot_id: botId,
        text,
      } = event;

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
      if (text.indexOf(this.keyword) !== -1) {
        emitEvent = true;
      } else if (subtype === constants.SUBTYPE.PD_HISTORY_MESSAGE) {
        emitEvent = true;
      }

      if (emitEvent) {
        return event;
      }
    },
  },
  sampleEmit,
};
