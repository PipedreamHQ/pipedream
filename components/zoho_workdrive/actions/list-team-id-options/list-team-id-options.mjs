import zoho_workdrive from "../../zoho_workdrive.app.mjs";

export default {
  key: "zoho_workdrive-list-team-id-options",
  name: "List Team ID Options",
  description: "Retrieves available options for the Team ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_workdrive,
  },
  async run({ $ }) {
    const options = await zoho_workdrive.propDefinitions.teamId.options.call(this.zoho_workdrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
