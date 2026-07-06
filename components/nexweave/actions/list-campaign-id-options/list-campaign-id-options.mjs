import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-list-campaign-id-options",
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
    nexweave,
  },
  async run({ $ }) {
    const options = await nexweave.propDefinitions.campaignId.options.call(this.nexweave, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
