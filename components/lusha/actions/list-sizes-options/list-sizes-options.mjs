import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-sizes-options",
  name: "List Company Sizes Options",
  description: "List the company size ranges Lusha accepts in the `Company Sizes` filter of **Search Companies** and **Search and Enrich Companies**. Each option's `value` is a JSON range such as `{\"min\":51,\"max\":200}`; pass it as is. Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
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
    const options = await this.lusha.listSizeOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
