import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-naics-codes-options",
  name: "List Company NAICS Codes Options",
  description: "List the NAICS industry codes Lusha accepts in the `Company NAICS Codes` filter of **Search Companies** and **Search and Enrich Companies**. Pass an option's `value` (e.g. `541511`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
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
    const options = await this.lusha.listNaicsCodeOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
