import relevanceAI from "../../relevance_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "relevance_ai-run-tool",
  name: "Run Tool",
  description: "Executes a specific tool within Relevance AI and waits for a response for up to 60 seconds. [See the documentation](https://relevanceai.com/docs/build-custom-tools/create-a-tool)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    relevanceAI,
    toolId: {
      propDefinition: [
        relevanceAI,
        "toolId",
      ],
    },
    parameters: {
      propDefinition: [
        relevanceAI,
        "parameters",
      ],
    },
    timeout: {
      propDefinition: [
        relevanceAI,
        "timeout",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.relevanceAI.executeTool({
      toolId: this.toolId,
      parameters: this.parameters,
      timeout: this.timeout,
    });
    $.export("$summary", `Successfully executed tool with ID ${this.toolId}`);
    return response;
  },
};
