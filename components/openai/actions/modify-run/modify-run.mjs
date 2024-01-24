import openai from "../../openai.app.mjs";

export default {
  key: "openai-modify-run",
  name: "Modify Run (Assistants)",
  description: "Modifies an existing run. [See the documentation](https://platform.openai.com/docs/api-reference/runs/modifyRun)",
  version: "0.0.6",
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
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.modifyRun({
      threadId: this.threadId,
      runId: this.runId,
      ...(this.metadata && {
        metadata: this.metadata,
      }),
    });

    $.export("$summary", `Successfully modified run with ID: ${this.runId}`);
    return response;
  },
};
