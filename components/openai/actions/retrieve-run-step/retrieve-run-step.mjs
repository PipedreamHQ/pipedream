import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-run-step",
  name: "Retrieve Run Step (Assistants)",
  description: "Retrieve a specific run step in a thread. [See the documentation](https://platform.openai.com/docs/api-reference/runs/getRunStep)",
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
    stepId: {
      propDefinition: [
        openai,
        "stepId",
        ({
          threadId, runId,
        }) => ({
          threadId,
          runId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.retrieveRunStep({
      $,
      threadId: this.threadId,
      runId: this.runId,
      stepId: this.stepId,
    });

    $.export("$summary", `Successfully retrieved run step with ID ${this.stepId}`);
    return response;
  },
};
