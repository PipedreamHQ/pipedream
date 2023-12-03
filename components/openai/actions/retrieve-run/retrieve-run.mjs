import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-run",
  name: "Retrieve Run",
  description: "Retrieves a specific run within a thread. [See the documentation](https://platform.openai.com/docs/api-reference)",
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
  },
  async run({ $ }) {
    const response = await this.openai.retrieveRun({
      threadId: this.threadId,
      runId: this.runId,
    });

    $.export("$summary", `Successfully retrieved run ${this.runId} in thread ${this.threadId}`);
    return response;
  },
};
