import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-list-solution-category-id-options",
  name: "List Solution Category ID Options",
  description: "Retrieves available options for the Solution Category ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshservice,
  },
  async run({ $ }) {
    const options = await freshservice.propDefinitions.solutionCategoryId.options
      .call(this.freshservice);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
