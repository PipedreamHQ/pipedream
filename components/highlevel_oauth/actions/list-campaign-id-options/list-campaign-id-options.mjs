import { highlevel_oauth } from "../../highlevel_oauth.app.mjs";

export default {
  key: "highlevel_oauth-list-campaign-id-options",
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
    highlevel_oauth,
  },
  async run({ $ }) {
    const options = await highlevel_oauth.propDefinitions.campaignId.options
      .call(this.highlevel_oauth, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
