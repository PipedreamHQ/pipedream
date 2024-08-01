import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-runs",
  name: "List Runs (Assistants)",
  description: "Returns a list of runs belonging to a thread. [See the documentation](https://platform.openai.com/docs/api-reference/runs/list)",
  version: "0.0.9",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
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
      resourceFn: this.openai.listRuns,
      args: {
        $,
        threadId: this.threadId,
        params: {
          order: this.order,
        },
      },
      max: this.limit,
    });

    const runs = [];
    for await (const run of response) {
      runs.push(run);
    }

    $.export("$summary", `Successfully retrieved runs for thread ${this.threadId}`);
    return runs;
  },
};
