import upviral from "../../upviral.app.mjs";

export default {
  key: "upviral-list-campaign-id-options",
  name: "List Campaign Id Options",
  description: "Retrieves available options for the Campaign Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upviral,
  },
  async run({ $ }) {
    const options = await upviral.propDefinitions.campaignId.options.call(this.upviral);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
