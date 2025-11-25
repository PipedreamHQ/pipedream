import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freshchat-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new message is received in a conversation. [See the documentation](https://developers.freshchat.com/api/#list_messages)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.freshchat,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        common.props.freshchat,
        "conversationId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastCreatedTime() {
      return this.db.get("lastCreatedTime");
    },
    _setLastCreatedTime(time) {
      this.db.set("lastCreatedTime", time);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New message received: ${message.id}`,
        ts: Date.parse(message.created_time),
      };
    },
    async processEvents(max) {
      const lastCreatedTime = this._getLastCreatedTime();
      let maxCreatedTime = lastCreatedTime;

      const results = this.freshchat.paginate({
        fn: this.freshchat.listMessages,
        args: {
          conversationId: this.conversationId,
        },
        resourceKey: "messages",
      });

      let messages = [];
      for await (const message of results) {
        if (!lastCreatedTime || Date.parse(message.created_time) > Date.parse(lastCreatedTime)) {
          if (!maxCreatedTime || Date.parse(message.created_time) > Date.parse(maxCreatedTime)) {
            maxCreatedTime = message.created_time;
          }
          messages.push(message);
        }
      }
      this._setLastCreatedTime(maxCreatedTime);

      if (max) {
        messages = messages.slice(0, max);
      }

      for (const message of messages) {
        this.$emit(message, this.generateMeta(message));
      }
    },
  },
  sampleEmit,
};
