import openai from "../../openai.app.mjs";

export default {
  key: "openai-cancel-run",
  name: "Cancel Run (Assistants)",
  description: "Cancels a run that is in progress. [See the documentation](https://platform.openai.com/docs/api-reference/runs/cancelRun)",
  version: "0.0.17",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async run({ $ }) {
    const response = await this.openai.cancelRun({
      $,
      threadId: this.threadId,
      runId: this.runId,
    });

    $.export("$summary", `Successfully cancelled run ${this.runId} in thread ${this.threadId}`);
    return response;
  },
};
