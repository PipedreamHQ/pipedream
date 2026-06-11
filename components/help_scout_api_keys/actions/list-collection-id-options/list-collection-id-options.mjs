import help_scout_api_keys from "../../help_scout_api_keys.app.mjs";

export default {
  key: "help_scout_api_keys-list-collection-id-options",
  name: "List Collection ID Options",
  description: "Retrieves available options for the Collection ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    help_scout_api_keys,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await help_scout_api_keys.propDefinitions.collectionId.options
      .call(this.help_scout_api_keys, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
