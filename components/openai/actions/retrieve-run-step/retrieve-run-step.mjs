import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-run-step",
  name: "Retrieve Run Step",
  description: "Retrieve a specific run step in a thread. [See the documentation](https://platform.openai.com/docs/api-reference)",
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
    stepId: {
      propDefinition: [
        openai,
        "stepId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.retrieveRunStep({
      threadId: this.threadId,
      runId: this.runId,
      stepId: this.stepId,
    });

    $.export("$summary", `Successfully retrieved run step with ID ${this.stepId}`);
    return response;
  },
};
