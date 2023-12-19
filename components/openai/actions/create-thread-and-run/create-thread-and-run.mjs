import { parseToolsArray } from "../../common/helpers.mjs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-thread-and-run",
  name: "Create Thread and Run (Assistants)",
  description: "Create a thread and run it in one request using the specified assistant ID and optional parameters. [See the documentation](https://platform.openai.com/docs/api-reference)",
  version: "0.1.3",
  type: "action",
  props: {
    openai,
    assistantId: {
      propDefinition: [
        openai,
        "assistantId",
      ],
    },
    thread: {
      type: "object",
      label: "Thread",
      description: "The thread object containing messages and other optional properties.",
      optional: true,
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
    const response = await this.openai.createThreadAndRun({
      assistant_id: this.assistantId,
      thread: this.thread,
      model: this.model,
      instructions: this.instructions,
      tools: parseToolsArray(this.tools),
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created thread and initiated run with ID: ${response.id}`);
    return response;
  },
};
