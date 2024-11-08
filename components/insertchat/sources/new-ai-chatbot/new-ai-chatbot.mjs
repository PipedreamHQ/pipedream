import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-new-ai-chatbot",
  name: "New AI Chatbot",
  description: "Emit new event when a new AI chatbot is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    insertchat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New AI Chatbot: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const chatbot = await this.insertchat.emitNewChatbot();
    const meta = this.generateMeta(chatbot);
    this.$emit(chatbot, meta);
  },
};
