import vida from "../../vida.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vida-provide-context",
  name: "Upload Additional Context for Conversation",
  description: "Uploads additional context for a conversation with your AI agent. Helpful when integrating data from external CRMs. [See the documentation](https://vida.io/docs/api-reference/knowledge/add-context)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vida,
    aiAgentId: {
      propDefinition: [
        vida,
        "aiAgentId",
      ],
    },
    additionalContext: {
      propDefinition: [
        vida,
        "additionalContext",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vida.uploadConversationContext({
      aiAgentId: this.aiAgentId,
      additionalContext: this.additionalContext,
    });
    $.export("$summary", `Successfully uploaded additional context for AI agent ${this.aiAgentId}`);
    return response;
  },
};
