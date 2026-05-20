import opinion_stage from "../../opinion_stage.app.mjs";

export default {
  key: "opinion_stage-list-item-id-options",
  name: "List Item ID Options",
  description: "Retrieves available options for the Item ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    opinion_stage,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await opinion_stage.propDefinitions.itemId.options.call(this.opinion_stage, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
