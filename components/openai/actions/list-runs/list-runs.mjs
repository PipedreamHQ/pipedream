import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-runs",
  name: "List Runs",
  description: "Returns a list of runs belonging to a thread. [See the documentation](https://platform.openai.com/docs/api-reference/runs/list)",
  version: "0.0.1",
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
        (c) => ({
          threadId: c.threadId,
        }), // Pass the threadId to the options method if needed
      ],
      optional: true,
    },
    order: {
      propDefinition: [
        openai,
        "order",
        (c) => ({
          threadId: c.threadId,
        }), // Pass the threadId to the options method if needed
      ],
      optional: true,
    },
    after: {
      propDefinition: [
        openai,
        "after",
        (c) => ({
          threadId: c.threadId,
        }), // Pass the threadId to the options method if needed
      ],
      optional: true,
    },
    before: {
      propDefinition: [
        openai,
        "before",
        (c) => ({
          threadId: c.threadId,
        }), // Pass the threadId to the options method if needed
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      ...(this.limit && {
        limit: this.limit,
      }),
      ...(this.order && {
        order: this.order,
      }),
      ...(this.after && {
        after: this.after,
      }),
      ...(this.before && {
        before: this.before,
      }),
    };

    const response = await this.openai.listRuns({
      threadId: this.threadId,
      ...params,
    });

    $.export("$summary", `Successfully retrieved runs for thread ${this.threadId}`);
    return response;
  },
};
