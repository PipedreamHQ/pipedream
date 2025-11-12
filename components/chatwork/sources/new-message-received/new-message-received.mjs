import common from "../common/common.mjs";

export default {
  ...common,
  key: "chatwork-new-message-received",
  name: "New Message Received",
  description: "Emit new event each time a new message is received.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.chatwork.listMessages({
        roomId: this.room,
      });
    },
    getTs(message) {
      return message.send_time;
    },
    generateMeta(message) {
      return {
        id: message.message_id,
        summary: message.body,
        ts: message.send_time,
      };
    },
  },
};
