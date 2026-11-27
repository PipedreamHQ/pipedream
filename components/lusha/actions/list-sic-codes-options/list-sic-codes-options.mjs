import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-sic-codes-options",
  name: "List Company SIC Codes Options",
  description: "List the SIC industry codes Lusha accepts in the `Company SIC Codes` filter of **Search Companies** and **Search and Enrich Companies**. Pass an option's `value` (e.g. `7372`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
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
    const options = await this.lusha.listSicCodeOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
