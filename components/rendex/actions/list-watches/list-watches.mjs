import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-list-watches",
  name: "List Watches",
  description: "List the watches on your Rendex account, optionally filtered by status. [See the documentation](https://rendex.dev/docs/watch#endpoints).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rendex,
    status: {
      type: "string",
      label: "Status",
      description: "Filter watches by status.",
      optional: true,
      default: "all",
      options: [
        "active",
        "paused",
        "all",
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
    const response = await this.rendex.listWatches({
      $,
      params: {
        status: this.status,
        limit: this.limit,
        cursor: this.cursor,
      },
    });

    const data = response.data;
    $.export("$summary", `Retrieved ${data?.items?.length ?? 0} watch(es)`);
    return data;
  },
};
