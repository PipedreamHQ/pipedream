import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-run-steps",
  name: "List Run Steps (Assistants)",
  description: "Returns a list of run steps belonging to a run. [See the documentation](https://platform.openai.com/docs/api-reference/runs/list-run-steps)",
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
    limit: {
      propDefinition: [
        openai,
        "limit",
      ],
    },
    order: {
      propDefinition: [
        openai,
        "order",
      ],
    },
  },
  async run({ $ }) {
    const response = this.openai.paginate({
      resourceFn: this.openai.listRunSteps,
      args: {
        $,
        threadId: this.threadId,
        runId: this.runId,
        params: {
          order: this.order,
        },
      },
      max: this.limit,
    });

    const runSteps = [];
    for await (const runStep of response) {
      runSteps.push(runStep);
    }

    $.export("$summary", `Successfully listed run steps for run ${this.runId}`);
    return runSteps;
  },
};
