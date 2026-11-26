import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-countries-options",
  name: "List Contact Countries Options",
  description: "List the country codes Lusha accepts in the `Contact Countries` filter of **Search Contacts** and **Search and Enrich Contacts**. Pass an option's `value` (e.g. `US`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
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
    const options = await this.lusha.listCountryOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
