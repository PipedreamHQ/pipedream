import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-seniority-options",
  name: "List Contact Seniority Levels Options",
  description: "List the seniority levels Lusha accepts in the `Contact Seniority Levels` filter of **Search Contacts** and **Search and Enrich Contacts**, mapping each level name to the numeric ID the filter takes (e.g. `4`). Does not use credits. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-contacts)",
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
    const options = await this.lusha.listSeniorityOptions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
