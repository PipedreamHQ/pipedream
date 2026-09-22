import the_odds_api from "../../the_odds_api.app.mjs";

export default {
  key: "the_odds_api-list-sport-options",
  name: "List Sport Options",
  description: "Retrieves available options for the Sport field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    the_odds_api,
  },
  async run({ $ }) {
    const options = await the_odds_api.propDefinitions.sport.options.call(this.the_odds_api);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
