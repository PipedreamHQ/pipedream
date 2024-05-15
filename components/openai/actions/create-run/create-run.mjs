import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";

export default {
  ...common,
  key: "openai-create-run",
  name: "Create Run (Assistants)",
  description: "Creates a run given a thread ID and assistant ID. [See the documentation](https://platform.openai.com/docs/api-reference/runs/create)",
  version: "0.1.4",
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
        "assistant",
      ],
      label: "Assistant ID",
      description: "The unique identifier for the assistant.",
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
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const response = await this.openai.createRun({
      $,
      threadId: this.threadId,
      data: {
        assistant_id: this.assistantId,
        model: this.model,
        instructions: this.instructions,
        tools: this.buildTools(),
        tool_resources: this.buildToolResources(),
        metadata: this.metadata,
      },
    });

    const summary = response.id
      ? `Successfully created a run with ID: ${response.id}`
      : `Successfully created a run in thread ${this.threadId}`;
    $.export("$summary", summary);
    return response;
  },
};
