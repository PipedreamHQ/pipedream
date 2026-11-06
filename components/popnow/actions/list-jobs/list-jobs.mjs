import app from "../../popnow.app.mjs";

export default {
  key: "popnow-list-jobs",
  name: "List Jobs",
  description: "List one page of tasks created by your API key, newest first, without inputs or outputs. Pass the returned `nextCursor` as **Cursor** to get the next page. [See the documentation](https://popnow.ai/docs/tasks)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of tasks to return, from 1 to 100, e.g. `50`. Defaults to 20.",
      optional: true,
      min: 1,
      max: 100,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Use **List Jobs** to get the `nextCursor` value from a previous page, e.g. `eyJpZCI6MTAwfQ==`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listJobs({
      $,
      params: {
        state: this.state,
        model: this.model,
        from: this.from,
        to: this.to,
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    const count = response?.items?.length ?? 0;
    const more = response?.hasMore
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully retrieved ${count} task(s)${more}`);
    return response;
  },
};
