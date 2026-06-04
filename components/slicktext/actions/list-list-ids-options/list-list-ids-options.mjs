import slicktext from "../../slicktext.app.mjs";

export default {
  key: "slicktext-list-list-ids-options",
  name: "List List IDs Options",
  description: "Retrieves available options for the List IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slicktext,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await slicktext.propDefinitions.listIds.options.call(this.slicktext, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
