import sitespeakai from "../../sitespeakai.app.mjs";

export default {
  key: "sitespeakai-send-query",
  name: "Send Query",
  description: "Queries your chatbot and returns the answer and URLs used to find the answer. [See the documentation](https://api-docs.sitespeak.ai/reference/api-reference/query)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sitespeakai,
    chatbotId: {
      propDefinition: [
        sitespeakai,
        "chatbotId",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The question or query text that you would like to send to your chatbot to answer.",
    },
    conversationId: {
      type: "string",
      label: "Conversation",
      description: "A unique identifier to group questions and answers sent to your chatbot.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sitespeakai.sendQuery({
      chatbotId: this.chatbotId,
      data: {
        prompt: this.prompt,
        conversation_id: this.conversationId,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully queried chatbot.");
    }

    return response;
  },
};
