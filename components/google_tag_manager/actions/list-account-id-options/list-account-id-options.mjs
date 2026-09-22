import google_tag_manager from "../../google_tag_manager.app.mjs";

export default {
  key: "google_tag_manager-list-account-id-options",
  name: "List Account ID Options",
  description: "Retrieves available options for the Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_tag_manager,
  },
  async run({ $ }) {
    const options = await google_tag_manager.propDefinitions.accountId.options
      .call(this.google_tag_manager);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
