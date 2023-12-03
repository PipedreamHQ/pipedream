import openai from "../../openai.app.mjs";

export default {
  key: "openai-modify-run",
  name: "Modify Run",
  description: "Modifies an existing run. [See the documentation](https://platform.openai.com/docs/api-reference)",
  version: "0.0.4",
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
