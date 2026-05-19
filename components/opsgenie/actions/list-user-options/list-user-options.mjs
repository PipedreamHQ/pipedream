import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-list-user-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    opsgenie,
  },
  async run({ $ }) {
    const options = await opsgenie.propDefinitions.user.options.call(this.opsgenie);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
