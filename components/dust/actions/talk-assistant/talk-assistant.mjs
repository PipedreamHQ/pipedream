import dust from "../../dust.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dust-talk-assistant",
  name: "Talk to Assistant",
  description: "Send a message to an assistant on Dust and receive an answer. [See the documentation](https://docs.dust.tt/reference/post_api-v1-w-wid-assistant-conversations-cid-messages)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dust,
    content: {
      propDefinition: [
        dust,
        "content",
      ],
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The unique identifier of the assistant.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The unique identifier of the conversation.",
    },
  },
  async run({ $ }) {
    const response = await this.dust.sendMessageToAssistant({
      content: this.content,
      assistantId: this.assistantId,
      conversationId: this.conversationId,
    });
    $.export("$summary", "Successfully sent message to assistant");
    return response;
  },
};
