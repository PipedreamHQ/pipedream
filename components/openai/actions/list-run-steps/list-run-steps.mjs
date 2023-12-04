import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-run-steps",
  name: "List Run Steps",
  description: "Returns a list of run steps belonging to a run. [See the documentation](https://platform.openai.com/docs/api-reference/runs/list-run-steps)",
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
    limit: {
      propDefinition: [
        openai,
        "limit",
      ],
      optional: true,
    },
    order: {
      propDefinition: [
        openai,
        "order",
      ],
      optional: true,
    },
    after: {
      propDefinition: [
        openai,
        "after",
      ],
      optional: true,
    },
    before: {
      propDefinition: [
        openai,
        "before",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.listRunSteps({
      threadId: this.threadId,
      runId: this.runId,
      limit: this.limit,
      order: this.order,
      after: this.after,
      before: this.before,
    });

    $.export("$summary", `Successfully listed run steps for run ${this.runId}`);
    return response;
  },
};
