import thoughtfulgpt from "../../thoughtfulgpt.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "thoughtfulgpt-process-content-macro",
  name: "Process Content Macro",
  description: "Processes given content using a specified macro. [See the documentation](https://docs.thoughtfulgpt.com/thoughtfulgpt-documentation/product-guide/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    thoughtfulgpt,
    content: {
      type: "string",
      label: "Content",
      description: "The content to be processed",
    },
    macro: {
      type: "string",
      label: "Macro",
      description: "The macro to process the content",
    },
  },
  async run({ $ }) {
    const response = await this.thoughtfulgpt.processContent({
      content: this.content,
      macro: this.macro,
    });
    $.export("$summary", `Successfully processed content using macro: ${this.macro}`);
    return response;
  },
};
