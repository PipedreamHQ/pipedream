// x-pd-ai: optimized
import dify from "../../dify.app.mjs";

export default {
  key: "dify-send-chat-message",
  name: "Send Chat Message",
  description: "Send a message to a Dify Chatflow, Chatbot, or Legacy Agent app and get back the assistant's reply. Not supported for Agent apps — the Dify API requires `streaming` response mode for those, and this action always uses `blocking` mode to return a single synchronous result. Use **List Conversations** to find a `Conversation ID` to continue an existing thread instead of starting a new one. [See the documentation](https://docs.dify.ai/en/api-reference/chat-messages/send-chat-message)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    query: {
      type: "string",
      label: "Query",
      description: "The user's message, e.g. `What are the specs of the iPhone 13 Pro Max?`",
    },
    user: {
      propDefinition: [
        dify,
        "user",
      ],
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of an existing conversation to continue. Omit this to start a new conversation — the response will include a new `conversation_id` to reuse on later calls for the same thread. Use **List Conversations** to find the ID of an existing conversation.",
      optional: true,
    },
    inputs: {
      propDefinition: [
        dify,
        "inputs",
      ],
    },
    autoGenerateName: {
      type: "boolean",
      label: "Auto Generate Name",
      description: "Automatically generate a title for a new conversation. Defaults to `true`. Ignored when `Conversation ID` is set, since the conversation already has a name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dify.sendChatMessage({
      $,
      data: {
        query: this.query,
        user: this.user,
        conversation_id: this.conversationId,
        inputs: this.inputs ?? {},
        auto_generate_name: this.autoGenerateName,
        response_mode: "blocking",
      },
    });

    $.export("$summary", `Sent message and received a reply in conversation ${response.conversation_id}`);
    return response;
  },
};
