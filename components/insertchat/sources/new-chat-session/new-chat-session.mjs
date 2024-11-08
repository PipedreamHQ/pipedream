import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-new-chat-session",
  name: "New Chat Session",
  description: "Emit new event when a new chat session is initiated. [See the documentation](https://docs.insertchat.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    insertchat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    userInfo: {
      propDefinition: [
        insertchat,
        "userInfo",
      ],
    },
    chatTranscript: {
      propDefinition: [
        insertchat,
        "chatTranscript",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New chat session: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const results = await this.insertchat.emitNewChatSession(this.userInfo, this.chatTranscript);
    for (const result of results) {
      const timestamp = Date.parse(result.created_at);
      if (timestamp > lastRun) {
        this.$emit(result, this.generateMeta(result));
      }
    }
    this.db.set("lastRun", this.timer.timestamp);
  },
};
