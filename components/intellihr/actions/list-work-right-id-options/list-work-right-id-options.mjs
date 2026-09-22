import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-list-work-right-id-options",
  name: "List Work Right ID Options",
  description: "Retrieves available options for the Work Right ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intellihr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await intellihr.propDefinitions.workRightId.options.call(this.intellihr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
