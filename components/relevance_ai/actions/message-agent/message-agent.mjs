import relevanceAi from "../../relevance_ai.app.mjs";

export default {
  key: "relevance_ai-message-agent",
  name: "Send Message to Agent",
  description: "Sends a message directly to an agent in Relevance AI. This action doesn't wait for an agent response.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    relevanceAi,
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of the agent to send the message to.",
    },
    conversationId: {
      propDefinition: [
        relevanceAi,
        "conversationId",
        ({ agentId }) => ({
          agentId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the agent.",
    },
  },
  async run({ $ }) {
    const response = await this.relevanceAi.sendMessage({
      $,
      data: {
        message: {
          role: "user",
          content: this.message,
        },
        debug: false,
        agent_id: this.agentId,
        conversation_id: this.conversationId,
      },
    });

    $.export("$summary", `Message sent to agent ID ${this.agentId}`);
    return response;
  },
};
