import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-list-campaign-id-options",
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
    relavate,
  },
  async run({ $ }) {
    const options = await relavate.propDefinitions.campaignId.options.call(this.relavate);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
