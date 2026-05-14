import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-list-authorized-team-id-options",
  name: "List Authorized Team Options",
  description: "Retrieves available options for the Authorized Team field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clickup,
  },
  async run({ $ }) {
    const options = await clickup.propDefinitions.authorizedTeamId.options.call(this.clickup);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
