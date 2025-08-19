import common from "../common/base.mjs";

export default {
  ...common,
  key: "zep-new-message",
  name: "New Message in Session",
  description: "Emit new event when a message is added to a session. [See the documentation](https://help.getzep.com/api-reference/memory/get-session-messages)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getNewResults(lastTs, max) {
      const sessionIds = await this.getRecentlyUpdatedSessionIds(lastTs);
      let messages = [];
      let maxTs = lastTs;

      for (const sessionId of sessionIds) {
        const results = this.paginateMessages(sessionId);

        for await (const message of results) {
          const ts = Date.parse(message.created_at);
          if (ts >= lastTs) {
            messages.push({
              ...message,
              session_id: sessionId,
            });
            maxTs = Math.max(maxTs, ts);
          }
        }
      }

      this._setLastTs(maxTs);

      // sort by created_at
      messages = messages.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

      if (max) {
        messages = messages.slice(-1 * max);
      }

      return messages;
    },
    async getRecentlyUpdatedSessionIds(lastTs) {
      const sessions = await this.getSessions({
        lastTs,
        orderBy: "updated_at",
        updateLastTs: false,
        max: 100,
      });
      return sessions?.map(({ session_id: id }) => id) || [];
    },
    async *paginateMessages(sessionId) {
      const params = {
        limit: 1000,
        cursor: 1,
      };
      let total;

      do {
        const { messages } = await this.zep.listMessages({
          sessionId,
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
