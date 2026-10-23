import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-list-deals",
  name: "List Deals",
  description: "List Cavyro deals, newest first, optionally filtered by pipeline and status. Use it to find `dealId` values for **Update Deal**. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cavyro,
    pipelineId: {
      propDefinition: [
        cavyro,
        "pipelineId",
      ],
      description: "Only return deals in this pipeline, e.g. `3`. Use **List Pipelines** to find it (the `id` field).",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return deals with this status. One of `open`, `won`, `lost`, e.g. `open`.",
      optional: true,
      options: [
        "open",
        "won",
        "lost",
      ],
    },
    page: {
      propDefinition: [
        cavyro,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const items = await this.cavyro.listDeals({
      $,
      params: {
        pipeline: this.pipelineId,
        status: this.status,
        page: this.page,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${items.length} deal(s)`);
    return items;
  },
};
