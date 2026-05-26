import wise from "../../wise.app.mjs";

export default {
  key: "wise-list-profile-id-options",
  name: "List Profile ID Options",
  description: "Retrieves available options for the Profile ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wise,
  },
  async run({ $ }) {
    const options = await wise.propDefinitions.profileId.options.call(this.wise);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
