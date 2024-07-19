import specific from "../../specific.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "specific-new-conversation-instant",
  name: "New Conversation Instant",
  description: "Emit new event whenever a new conversation is initiated. [See the documentation](https://public-api.specific.app/docs/introduction/welcome)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    specific: {
      type: "app",
      app: "specific",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch
    },
    async activate() {
      // No activation steps needed
    },
    async deactivate() {
      // No deactivation steps needed
    },
  },
  async run(event) {
    const response = await this.specific.emitNewConversationInitiated();
    this.$emit(response, {
      id: response.id,
      summary: `New conversation initiated: ${response.id}`,
      ts: Date.now(),
    });
  },
};
