import bloomerang from "../../bloomerang.app.mjs";

export default {
  key: "bloomerang-list-campaign-id-options",
  name: "List Campaign Options",
  description: "Retrieves available options for the Campaign field.",
  version: "0.0.2",
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
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bloomerang.propDefinitions.campaignId.options
      .call(this.bloomerang, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
