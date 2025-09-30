import thoughtfulgpt from "../../thoughtful_gpt.app.mjs";

export default {
  key: "thoughtful_gpt-process-content-macro",
  name: "Process Content Macro",
  description: "Processes given content using a specified macro. [See the documentation](https://docs.thoughtfulgpt.com/thoughtfulgpt-documentation/product-guide/api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thoughtfulgpt,
    content: {
      type: "string",
      label: "Content",
      description: "Transcript content to be processed",
    },
    macro: {
      type: "string",
      label: "Macro",
      description: "The macro to apply to the content",
    },
    llmModel: {
      type: "string",
      label: "LLM Model",
      description: "The LLM Model to use for processing",
      optional: true,
      default: "gpt-3.5",
    },
  },
  async run({ $ }) {
    const response = await this.thoughtfulgpt.processContent({
      $,
      data: {
        content: this.content,
        macro: this.macro,
        llm_model: this.llmModel,
      },
    });
    $.export("$summary", `Successfully processed content using macro: ${this.macro}`);
    return response;
  },
};
