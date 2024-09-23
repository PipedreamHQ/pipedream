import openai from "../../openai.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "openai-submit-tool-outputs-to-run",
  name: "Submit Tool Outputs to Run (Assistants)",
  description: "Submits tool outputs to a run that requires action. [See the documentation](https://platform.openai.com/docs/api-reference/runs/submitToolOutputs)",
  version: "0.0.10",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    runId: {
      propDefinition: [
        openai,
        "runId",
        ({ threadId }) => ({
          threadId,
        }),
      ],
    },
    toolOutputs: {
      propDefinition: [
        openai,
        "toolOutputs",
      ],
    },
  },
  async run({ $ }) {
    const parsedToolOutputs = typeof this.toolOutputs === "string"
      ? JSON.parse(this.toolOutputs)
      : Array.isArray(this.toolOutputs)
        ? this.toolOutputs.map((output) => typeof output === "string"
          ? JSON.parse(output)
          : output)
        : null;

    if (!parsedToolOutputs) {
      throw new ConfigurationError("Could not parse tool outputs as JSON.");
    }

    const response = await this.openai.submitToolOutputs({
      $,
      threadId: this.threadId,
      runId: this.runId,
      data: {
        tool_outputs: parsedToolOutputs,
      },
    });

    $.export("$summary", `Successfully submitted tool outputs to run ${this.runId}`);
    return response;
  },
};
