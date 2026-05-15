import anchor_browser from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-list-profile-name-options",
  name: "List Profile Name Options",
  description: "Retrieves available options for the Profile Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    anchor_browser,
  },
  async run({ $ }) {
    const options = await anchor_browser.propDefinitions.profileName.options
      .call(this.anchor_browser);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
