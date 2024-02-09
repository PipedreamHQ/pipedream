import { axios } from "@pipedream/platform";
import chaindesk from "../../chaindesk.app.mjs";

export default {
  key: "chaindesk-new-response-generated",
  name: "New Response Generated",
  description: "Emits an event when a new message from an agent is created. [See the documentation](https://docs.chaindesk.ai/api-reference/endpoint/agents/query)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    chaindesk,
    db: "$.service.db",
    agentId: {
      propDefinition: [
        chaindesk,
        "agentId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, sender, text, created_at,
      } = data;
      return {
        id,
        summary: `New message from ${sender}: ${text.slice(0, 100)}`,
        ts: Date.parse(created_at),
      };
    },
  },
  hooks: {
    async deploy() {
      const messages = await this.chaindesk.getMessages({
        agentId: this.agentId,
        limit: 50,
      });
      messages.forEach((message) => {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      });
    },
  },
  async run() {
    const lastMessageId = this.db.get("lastMessageId") || 0;
    const messages = await this.chaindesk.getMessages({
      agentId: this.agentId,
      sinceId: lastMessageId,
    });

    messages.forEach((message) => {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);
    });

    if (messages.length > 0) {
      const maxId = Math.max(...messages.map((message) => message.id));
      this.db.set("lastMessageId", maxId);
    }
  },
};
