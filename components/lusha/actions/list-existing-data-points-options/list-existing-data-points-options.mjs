import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-existing-data-points-options",
  name: "List Existing Data Points Options",
  description: "List the data points Lusha accepts in the `Existing Data Points` filter of **Search Contacts** and **Search and Enrich Contacts**, used to return only contacts that have that data (e.g. `work_email`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
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
    const options = await this.lusha.listExistingDataPointOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
