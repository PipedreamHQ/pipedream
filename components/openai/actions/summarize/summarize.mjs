import common from "../common/common-helper.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "Summarize Text",
  version: "0.1.0",
  key: "openai-summarize",
  description: "Summarizes text using the Chat API. [See the documentation](https://platform.openai.com/docs/api-reference/chat)",
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
      options: constants.SUMMARIZE_LENGTH,
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
      const output = {
        messages,
      };
      if (this.n > 1) {
        output.summaries = response.choices?.map(({ message }) => message.content);
      } else {
        output.summary = response.choices?.[0]?.message?.content;
      }
      return output;
    },
  },
};
