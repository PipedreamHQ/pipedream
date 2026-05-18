import bloomerang from "../../bloomerang.app.mjs";

export default {
  key: "bloomerang-list-fund-id-options",
  name: "List Fund Options",
  description: "Retrieves available options for the Fund field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bloomerang,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bloomerang.propDefinitions.fundId.options
      .call(this.bloomerang, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
