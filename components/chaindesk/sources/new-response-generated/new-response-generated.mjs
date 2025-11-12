import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import chaindesk from "../../chaindesk.app.mjs";

export default {
  key: "chaindesk-new-response-generated",
  name: "New Response Generated",
  description: "Emit new event when a new message from an agent is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    chaindesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Id of the conversation you want to receive the events.",
    },
  },
  methods: {
    _getLastDatetime() {
      return this.db.get("lastDatetime") || 0;
    },
    _setLastDatetime(lastDatetime = null) {
      this.db.set("lastDatetime", lastDatetime);
    },
    generateMeta({
      id, createdAt,
    }) {
      return {
        id,
        summary: `New message from agent with Id: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
    async startEvent(maxResults) {
      const lastDatetime = this._getLastDatetime();

      let { messages } = await this.chaindesk.listMessages({
        conversationId: this.conversationId,
      });

      messages = messages
        .filter(({ from }) => from === "agent")
        .filter(({ createdAt }) => Date.parse(createdAt) > lastDatetime);
      if (maxResults && (messages.length > maxResults)) messages.length = maxResults;

      if (messages.length) this._setLastDatetime(Date.parse(messages[0].createdAt));

      for (const message of messages.reverse()) {
        this.$emit(message, this.generateMeta(message));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
