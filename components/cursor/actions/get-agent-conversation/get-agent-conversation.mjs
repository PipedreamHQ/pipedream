import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-get-agent-conversation",
  name: "Get Agent Conversation",
  description: "Retrieve the conversation history of a cloud agent, including all user prompts and assistant responses. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#agent-conversation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cursor,
    agentId: {
      propDefinition: [
        cursor,
        "agentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cursor.getAgentConversation({
      $,
      agentId: this.agentId,
    });
    $.export("$summary", `Successfully retrieved conversation for agent ${this.agentId}`);
    return response;
  },
};
