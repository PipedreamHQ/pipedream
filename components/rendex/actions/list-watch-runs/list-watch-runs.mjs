import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-list-watch-runs",
  name: "List Watch Runs",
  description: "List the run history for a watch (most recent first). [See the documentation](https://rendex.dev/docs/watch#reading-run-history).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rendex,
    watchId: {
      propDefinition: [
        rendex,
        "watchId",
      ],
    },
    limit: {
      propDefinition: [
        rendex,
        "limit",
      ],
    },
    cursor: {
      propDefinition: [
        rendex,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rendex.listRuns(this.watchId, {
      $,
      params: {
        limit: this.limit,
        cursor: this.cursor,
      },
    });

    const data = response.data;
    $.export("$summary", `Retrieved ${data?.items?.length ?? 0} run(s)`);
    return data;
  },
};
