import kingsumo from "../../kingsumo.app.mjs";

export default {
  key: "kingsumo-list-giveaway-id-options",
  name: "List Giveaway Id Options",
  description: "Retrieves available options for the Giveaway Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kingsumo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await kingsumo.propDefinitions.giveawayId.options.call(this.kingsumo, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
