import google_ads from "../../google_ads.app.mjs";

export default {
  key: "google_ads-list-account-id-options",
  name: "List Use Google Ads As Options",
  description: "Retrieves available options for the Use Google Ads As field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_ads,
  },
  async run({ $ }) {
    const options = await google_ads.propDefinitions.accountId.options.call(this.google_ads);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
