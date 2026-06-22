import proofly from "../../proofly.app.mjs";

export default {
  key: "proofly-list-campaign-id-options",
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
    proofly,
  },
  async run({ $ }) {
    const options = await proofly.propDefinitions.campaignId.options.call(this.proofly, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
