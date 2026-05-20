import raisely from "../../raisely.app.mjs";

export default {
  key: "raisely-list-campaign-id-options",
  name: "List Campaign Options",
  description: "Retrieves available options for the Campaign field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    raisely,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await raisely.propDefinitions.campaignId.options.call(this.raisely, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
