import common from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack-new-message-in-channels",
  name: "New Message In Channels (Instant)",
  version: "1.0.21",
  description: "Emit new event when a new message is posted to one or more channels",
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
    resolveNames: {
      propDefinition: [
        common.props.slack,
        "resolveNames",
      ],
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
    ignoreThreads: {
      type: "boolean",
      label: "Ignore replies in threads",
      description: "Ignore replies to messages in threads",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New message in channel";
    },
    async processEvent(event) {
      if (event.type !== "message") {
        console.log(`Ignoring event with unexpected type "${event.type}"`);
        return;
      }
      if (event.subtype && !constants.ALLOWED_MESSAGE_IN_CHANNEL_SUBTYPES.includes(event.subtype)) {
        // This source is designed to just emit an event for each new message received.
        // Due to inconsistencies with the shape of message_changed and message_deleted
        // events, we are ignoring them for now. If you want to handle these types of
        // events, feel free to change this code!!
        console.log("Ignoring message with subtype.");
        return;
      }
      if ((this.ignoreBot) && (event.subtype == "bot_message" || event.bot_id)) {
        return;
      }
      // There is no thread message type only the thread_ts field
      // indicates if the message is part of a thread in the event.
      if (this.ignoreThreads && event.thread_ts) {
        console.log("Ignoring reply in thread");
        return;
      }
      if (this.resolveNames) {
        if (event.user) {
          event.user_id = event.user;
          event.user = await this.getUserName(event.user);
        } else if (event.bot_id) {
          event.bot = await this.getBotName(event.bot_id);
        }
        event.channel_id = event.channel;
        event.channel = await this.getConversationName(event.channel);
        if (event.team) {
          event.team_id = event.team;
          event.team = await this.getTeamName(event.team);
        }
      }
      return event;
    },
  },
  sampleEmit,
};
