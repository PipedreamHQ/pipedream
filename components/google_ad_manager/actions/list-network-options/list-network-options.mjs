import google_ad_manager from "../../google_ad_manager.app.mjs";

export default {
  key: "google_ad_manager-list-network-options",
  name: "List Network Options",
  description: "Retrieves available options for the Network field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_ad_manager,
  },
  async run({ $ }) {
    const options = await google_ad_manager.propDefinitions.network.options
      .call(this.google_ad_manager);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
