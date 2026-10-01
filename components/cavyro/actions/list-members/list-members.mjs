import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-list-members",
  name: "List Members",
  description: "List the members of the Cavyro workspace. Use the `user_id` field (not `id`) as `assigneeIds` in **Create Deal**. [See the documentation](https://developers.cavyro.com)",
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
    const items = await this.cavyro.listMembers({
      $,
      params: {
        page: this.page,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${items.length} member(s)`);
    return items;
  },
};
