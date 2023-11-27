import { parseToolsArray } from "../../common/helpers.mjs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-run",
  name: "Create Run",
  description: "Creates a run given a thread ID and assistant ID. [See the documentation](https://platform.openai.com/docs/api-reference/runs/create)",
  version: "0.1.0",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    assistantId: {
      propDefinition: [
        openai,
        "assistantId",
      ],
    },
    model: {
      propDefinition: [
        openai,
        "model",
      ],
    },
    instructions: {
      propDefinition: [
        openai,
        "instructions",
      ],
    },
    tools: {
      propDefinition: [
        openai,
        "tools",
      ],
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.createRun({
      threadId: this.threadId,
      assistantId: this.assistantId,
      model: this.model,
      instructions: this.instructions,
      tools: parseToolsArray(this.tools),
      metadata: this.metadata,
    });

    const summary = response.id
      ? `Successfully created a run with ID: ${response.id}`
      : `Successfully created a run in thread ${this.threadId}`;
    $.export("$summary", summary);
    return response;
  },
};
