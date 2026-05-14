import ayrshare from "../../ayrshare.app.mjs";

export default {
  key: "ayrshare-list-profile-to-delete-options",
  name: "List Profile to Delete Options",
  description: "Retrieves available options for the Profile to Delete field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ayrshare,
  },
  async run({ $ }) {
    const options = await ayrshare.propDefinitions.profileToDelete.options.call(this.ayrshare);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
