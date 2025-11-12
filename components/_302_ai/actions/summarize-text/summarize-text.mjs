import common from "../common/common-helper.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  name: "Summarize Text",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "_302_ai-summarize-text",
  description: "Summarize long-form text into concise, readable output using the 302.AI Chat API. Great for reports, content digestion, and executive briefs. [See documentation](https://doc.302.ai/147522039e0)",
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
      const n = this.n
        ? parseInt(this.n)
        : 1;
      if (n > 1) {
        output.summaries = response.choices?.map(({ message }) => message.content);
      } else {
        output.summary = response.choices?.[0]?.message?.content;
      }
      return output;
    },
  },
};

