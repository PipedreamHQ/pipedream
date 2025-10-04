import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-run",
  name: "Retrieve Run (Assistants)",
  description: "Retrieves a specific run within a thread. [See the documentation](https://platform.openai.com/docs/api-reference/runs/getRun)",
  version: "0.0.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.openai.retrieveRun({
      $,
      threadId: this.threadId,
      runId: this.runId,
    });

    $.export("$summary", `Successfully retrieved run ${this.runId} in thread ${this.threadId}`);
    return response;
  },
};
