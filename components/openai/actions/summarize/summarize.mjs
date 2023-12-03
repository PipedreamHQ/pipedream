import common from "../common/common-helper.mjs";

export default {
  ...common,
  name: "Summarize Text",
  version: "0.0.8",
  key: "openai-summarize",
  description: "Summarizes text using the Chat API",
  type: "action",
  props: {
    ...common.props,
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
