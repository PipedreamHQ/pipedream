import tawkTo from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-chat-ended-instant",
  name: "Chat Ended Instant",
  description: "Emits an event when a chat ends, usually after 90-150 seconds of inactivity. The event includes the chat id, end time, and last message.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tawkTo: {
      type: "app",
      app: "tawk_to",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    chatId: tawkTo.propDefinitions.chatId,
    endTime: tawkTo.propDefinitions.endTime,
    lastMessage: tawkTo.propDefinitions.lastMessage,
  },
  hooks: {
    async activate() {
      const chatId = this.chatId;
      const endTime = this.endTime;
      const lastMessage = this.lastMessage;

      const result = await this.tawkTo.endChat(chatId, endTime, lastMessage);

      this.db.set("chatId", result.data.chatId);
    },
    async deactivate() {
      const chatId = this.db.get("chatId");
      await this.tawkTo.deleteChat(chatId);
    },
  },
  async run(event) {
    const {
      headers, body, method, path,
    } = event;

    if (method !== "POST") {
      return this.http.respond({
        status: 405,
      });
    }

    if (!body || !headers) {
      return this.http.respond({
        status: 400,
      });
    }

    this.$emit(body, {
      id: body.chatId,
      summary: `Chat ${body.chatId} ended`,
      ts: Date.parse(body.endTime),
    });

    this.http.respond({
      status: 200,
    });
  },
};
