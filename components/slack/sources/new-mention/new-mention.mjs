import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-mention",
  name: "New Mention (Instant)",
  version: "1.0.5",
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
    keyword: {
      propDefinition: [
        common.props.slack,
        "keyword",
      ],
    },
    isUsername: {
      propDefinition: [
        common.props.slack,
        "isUsername",
      ],
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      // emit historical events
      const messages = await this.getMatches({
        query: this.keyword,
        sort: "timestamp",
      });
      const filteredMessages = this.conversations?.length > 0
        ? messages.filter((message) => this.conversations.includes(message.channel.id))
        : messages;
      await this.emitHistoricalEvents(filteredMessages.slice(-25).reverse());
    },
  },
  methods: {
    ...common.methods,
    async getMatches(params) {
      return (await this.slack.sdk().search.messages(params)).messages.matches || [];
    },
    async emitHistoricalEvents(messages) {
      for (const message of messages) {
        const event = await this.processEvent(message);
        if (event) {
          if (!event.client_msg_id) {
            event.pipedream_msg_id = `pd_${Date.now()}_${Math.random().toString(36)
              .substr(2, 10)}`;
          }

          this.$emit(event, {
            id: event.client_msg_id || event.pipedream_msg_id,
            summary: this.getSummary(event),
            ts: event.event_ts || Date.now(),
          });
        }
      }
    },
    getSummary() {
      return "New mention received";
    },
    async processEvent(event) {
      if (event.type !== "message") {
        console.log(`Ignoring event with unexpected type "${event.type}"`);
        return;
      }
      if (event.subtype != null && event.subtype != "bot_message" && event.subtype != "file_share") {
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
      let emitEvent = false;
      const elements = event.blocks[0]?.elements[0]?.elements;

      if (this.isUsername && elements) {
        for (const item of elements) {
          if (item.user_id) {
            const username = await this.getUserName(item.user_id);
            if (username === this.keyword) {
              emitEvent = true;
              break;
            }
          }
        }

      } else if (event.text.indexOf(this.keyword) !== -1) {
        emitEvent = true;
      }
      if (emitEvent) {
        return event;
      }
    },
  },
};
