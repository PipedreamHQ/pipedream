import relevanceAi from "../../relevance_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "relevance_ai-message-agent",
  name: "Send Message to Agent",
  description: "Sends a message directly to an agent in Relevance AI. This action doesn't wait for an agent response.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    relevanceAi,
    agentId: {
      propDefinition: [
        relevanceAi,
        "agentId",
      ],
    },
    message: {
      propDefinition: [
        relevanceAi,
        "message",
      ],
    },
    cc: {
      propDefinition: [
        relevanceAi,
        "cc",
        (c) => ({
          optional: true,
        }), // Making CC optional explicitly
      ],
    },
  },
  async run({ $ }) {
    const response = await this.relevanceAi.sendMessage({
      agentId: this.agentId,
      message: this.message,
      cc: this.cc,
    });

    $.export("$summary", `Message sent to agent ID ${this.agentId}`);
    return response;
  },
};
