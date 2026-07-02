import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-magic-prompt",
  name: "New Magic Prompt Response (Instant)",
  description: "Emit new event when a Speak AI Magic Prompt response is ready (`chat.status`). [See the documentation](https://docs.speakai.co/).",
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
    getSummary(resource) {
      return `New Magic Prompt response ${resource.messageId || resource.promptId || ""}`.trim();
    },
    async hydrate(resource) {
      const res = await this.app.getPromptsHistory({
        headers: {
          Accept: "application/json",
        },
        params: {
          pageSize: 100,
        },
      });
      const history = res?.data?.history || [];
      const match = history.find((item) =>
        (resource.messageId && item.messageId === resource.messageId)
        || (resource.promptId && item.promptId === resource.promptId));
      return match || {
        promptId: resource.promptId,
        messageId: resource.messageId,
        prompt: resource.prompt,
        answer: resource.answer,
        mediaIds: resource.mediaIds,
        folderId: resource.folderId,
      };
    },
  },
  sampleEmit,
};
