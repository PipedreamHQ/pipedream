import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-list-pipelines",
  name: "List Pipelines",
  description: "List the deal pipelines in the Cavyro workspace (`id`, `name`). Use **Get Pipeline** with an `id` to get its stages, then **Create Deal**. [See the documentation](https://developers.cavyro.com)",
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
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to return, 100 per page, e.g. `2`. Defaults to `1`.",
      optional: true,
      min: 1,
    },
  },
  async run({ $ }) {
    const items = await this.cavyro.listPipelines({
      $,
      params: {
        page: this.page,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${items.length} pipeline(s)`);
    return items;
  },
};
