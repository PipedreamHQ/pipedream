import azureOpenAI from "../../azure_openai_service.app.mjs";
import common from "../common/common-helper.mjs";

export default {
  ...common,
  key: "azure_openai_service-summarize",
  name: "Summarize",
  description: "Summarizes a text message with the GPT-35-Turbo and GPT-4 models. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    azureOpenAI,
    text: {
      label: "Text",
      description: "The text to summarize",
      type: "string",
    },
    length: {
      label: "Summary Length",
      description: "The length of the summary",
      type: "string",
      optional: true,
      options: [
        "word",
        "sentence",
        "paragraph",
        "page",
      ],
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    systemInstructions() {
      return "Your goal is to summarize the text the user provides. Please follow the length guidelines presented in the prompt.";
    },
    maxLength() {
      return this.length
        ? ` in one ${this.length}`
        : "";
    },
    userMessage() {
      return `Summarize the following text${this.maxLength()}: ${this.text}`;
    },
    summary(response) {
      return `Successfully created summary response with ID ${response.id}.`;
    },
    formatOutput({
      messages, response,
    }) {
      if (!messages || !response) {
        throw new Error("Invalid API output, please reach out to https://pipedream.com/support");
      }
      return {
        summary: response.choices?.[0]?.message?.content,
        messages,
      };
    },
  },
};
