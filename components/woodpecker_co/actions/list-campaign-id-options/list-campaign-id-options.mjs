import woodpecker_co from "../../woodpecker_co.app.mjs";

export default {
  key: "woodpecker_co-list-campaign-id-options",
  name: "List Campaign ID Options",
  description: "Retrieves available options for the Campaign ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    woodpecker_co,
  },
  async run({ $ }) {
    const options = await woodpecker_co.propDefinitions.campaignId.options
      .call(this.woodpecker_co, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
