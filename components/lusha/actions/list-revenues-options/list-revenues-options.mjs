import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-revenues-options",
  name: "List Company Revenues Options",
  description: "List the company revenue ranges Lusha accepts in the `Company Revenues` filter of **Search Companies** and **Search and Enrich Companies**. Each option's `value` is a JSON range such as `{\"min\":1000000,\"max\":10000000}`; pass it as is. Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lusha,
  },
  async run({ $ }) {
    const options = await this.lusha.listRevenueOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
