import iauditor_by_safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  key: "iauditor_by_safetyculture-list-group-id-options",
  name: "List Group Options",
  description: "Retrieves available options for the Group field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    iauditor_by_safetyculture,
  },
  async run({ $ }) {
    const options = await iauditor_by_safetyculture.propDefinitions.groupId.options
      .call(this.iauditor_by_safetyculture);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
