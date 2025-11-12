import azureOpenAI from "../../azure_openai_service.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "azure_openai_service-chat",
  name: "Chat",
  description: "Create completions for chat messages with the GPT-35-Turbo and GPT-4 models. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    azureOpenAI,
    userMessage: {
      type: "string",
      label: "User Message",
      description: "The user messages to provide instructions to the assistant.",
    },
    systemInstructions: {
      label: "System Instructions",
      type: "string",
      description: "The system message helps set the behavior of the assistant. For example: \"You are a helpful assistant.\"",
      optional: true,
    },
    messages: {
      label: "Prior Message History",
      type: "string[]",
      description: "_Advanced_. Because [the models have no memory of past chat requests](https://platform.openai.com/docs/guides/chat/introduction), all relevant information must be supplied via the conversation. You can provide [an array of messages](https://platform.openai.com/docs/guides/chat/introduction) from prior conversations here. If this param is set, the action ignores the values passed to **System Instructions** and **Assistant Response**, appends the new **User Message** to the end of this array, and sends it to the API.",
      optional: true,
    },
    ...common.props,
  },
  async run({ $ }) {
    const data = this._getChatArgs();
    const response = await this.azureOpenAI.createChatCompletion({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully sent chat with ID ${response.id}.`);
    }

    const { messages } = data;
    return {
      original_messages: messages,
      original_messages_with_assistant_response: messages.concat(response.choices[0]?.message),
      ...response,
    };
  },
};
