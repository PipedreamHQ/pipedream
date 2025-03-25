import vectorshift from "../../vectorshift.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "vectorshift-new-chatbot",
  name: "New Chatbot Created",
  description: "Emit new event when a chatbot is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vectorshift,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      try {
        const chatbots = await this.vectorshift.listChatbots();
        if (!Array.isArray(chatbots)) {
          throw new Error("Chatbots response is not an array");
        }
        const sortedChatbots = chatbots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const recentChatbots = sortedChatbots.slice(0, 50).reverse();
        for (const chatbot of recentChatbots) {
          this.$emit(chatbot, {
            id: chatbot.id,
            summary: `New Chatbot: ${chatbot.name || "Unnamed"}`,
            ts: chatbot.created_at
              ? Date.parse(chatbot.created_at)
              : Date.now(),
          });
        }
        const chatbotIds = chatbots.map((cb) => cb.id);
        await this.db.set("chatbotIds", chatbotIds);
      } catch (error) {
        console.error(`Error in deploy hook: ${error.message}`);
      }
    },
    async activate() {
      // No webhook setup required
    },
    async deactivate() {
      // No webhook teardown required
    },
  },
  async run() {
    try {
      const currentChatbots = await this.vectorshift.listChatbots();
      if (!Array.isArray(currentChatbots)) {
        throw new Error("Chatbots response is not an array");
      }
      const storedChatbotIds = await this.db.get("chatbotIds") || [];
      const newChatbots = currentChatbots.filter((chatbot) => !storedChatbotIds.includes(chatbot.id));

      for (const chatbot of newChatbots) {
        this.$emit(chatbot, {
          id: chatbot.id,
          summary: `New Chatbot: ${chatbot.name || "Unnamed"}`,
          ts: chatbot.created_at
            ? Date.parse(chatbot.created_at)
            : Date.now(),
        });
      }

      const updatedChatbotIds = currentChatbots.map((cb) => cb.id);
      await this.db.set("chatbotIds", updatedChatbotIds);
    } catch (error) {
      console.error(`Error in run method: ${error.message}`);
    }
  },
};
