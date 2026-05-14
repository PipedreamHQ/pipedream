import gosquared from "../../gosquared.app.mjs";

export default {
  key: "gosquared-list-site-token-options",
  name: "List Site Token Options",
  description: "Retrieves available options for the Site Token field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gosquared,
  },
  async run({ $ }) {
    const options = await gosquared.propDefinitions.siteToken.options.call(this.gosquared);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
