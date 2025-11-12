import chaindesk from "../../chaindesk.app.mjs";

export default {
  key: "chaindesk-submit-message",
  name: "Submit Message",
  description: "Allows the API to send a message input from the user.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chaindesk,
    agentId: {
      propDefinition: [
        chaindesk,
        "agentId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query you want to ask your agent.",
    },
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Id of the conversation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chaindesk.sendMessage({
      $,
      agentId: this.agentId,
      data: {
        query: this.query,
        conversationId: this.conversationId,
      },
    });

    $.export("$summary", `Message successfully submitted to agent ID ${this.agentId}`);
    return response;
  },
};
