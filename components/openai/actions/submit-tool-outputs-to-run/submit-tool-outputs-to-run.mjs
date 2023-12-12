import openai from "../../openai.app.mjs";

export default {
  key: "openai-submit-tool-outputs-to-run",
  name: "Submit Tool Outputs to Run (Assistants)",
  description: "Submits tool outputs to a run that requires action. [See the documentation](https://platform.openai.com/docs/api-reference/runs/submitToolOutputs)",
  version: "0.0.5",
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
    const parsedToolOutputs = this.toolOutputs.map(JSON.parse);
    const response = await this.openai.submitToolOutputs({
      threadId: this.threadId,
      runId: this.runId,
      toolOutputs: parsedToolOutputs,
    });

    $.export("$summary", `Successfully submitted tool outputs to run ${this.runId}`);
    return response;
  },
};
