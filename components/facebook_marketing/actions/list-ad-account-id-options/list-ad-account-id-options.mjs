import facebook_marketing from "../../facebook_marketing.app.mjs";

export default {
  key: "facebook_marketing-list-ad-account-id-options",
  name: "List Ad Account ID Options",
  description: "Retrieves available options for the Ad Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    facebook_marketing,
  },
  async run({ $ }) {
    const options = await facebook_marketing.propDefinitions.adAccountId.options
      .call(this.facebook_marketing);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
