import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-ai-chat",
  name: "New AI Chat Response (Instant)",
  description: "Emit new event when a Speak AI Chat response is ready (`chat.status`). [See the documentation](https://docs.speakai.co/api/ai-chat/#get-prompt).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.CHAT_STATUS,
      ];
    },
    async getData(resource) {
      const { data: { history } } = await this.app.listPrompts();
      const match = history.find(({
        promptId, messageId,
      }) => (resource.promptId && promptId === resource.promptId)
        || (resource.messageId && messageId === resource.messageId));
      return match || resource;
    },
    generateMeta(resource, data) {
      return {
        id: this.getEventId(resource),
        summary: `New AI Chat Response: ${resource.messageId || resource.promptId}`,
        ts: this.getEventTs(data),
      };
    },
  },
  sampleEmit,
};
