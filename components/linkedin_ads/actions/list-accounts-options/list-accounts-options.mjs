import linkedin_ads from "../../linkedin_ads.app.mjs";

export default {
  key: "linkedin_ads-list-accounts-options",
  name: "List Accounts Options",
  description: "Retrieves available options for the Accounts field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linkedin_ads,
  },
  async run({ $ }) {
    const options = await linkedin_ads.propDefinitions.accounts.options.call(this.linkedin_ads, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
