import common from "../common/base.mjs";

export default {
  ...common,
  key: "zep-new-message",
  name: "New Message in Session",
  description: "Emit new event when a message is added to a session. [See the documentation](https://help.getzep.com/api-reference/memory/get-session-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    sessionId: {
      propDefinition: [
        common.props.zep,
        "sessionId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getNewResults(lastTs, max) {
      const results = this.paginateMessages();

      let messages = [];
      for await (const message of results) {
        const ts = Date.parse(message.created_at);
        if (ts >= lastTs) {
          messages.push(message);
        }
      }

      if (messages.length) {
        this._setLastTs(Date.parse(messages[messages.length - 1].created_at));
      }

      if (max) {
        messages = messages.slice(-1 * max);
      }

      return messages;
    },
    async *paginateMessages() {
      const params = {
        limit: 1000,
        cursor: 1,
      };
      let total;

      do {
        const { messages } = await this.zep.listMessages({
          sessionId: this.sessionId,
          params,
        });
        for (const message of messages) {
          yield message;
        }
        total = messages?.length;
        params.cursor++;
      } while (total);
    },
    generateMeta(message) {
      return {
        id: message.uuid,
        summary: `New Message: ${message.content}`,
        ts: Date.parse(message.created_at),
      };
    },
  },
};
