import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-list-user-type-options",
  name: "List User Type Options",
  description: "Retrieves available options for the User Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onedesk,
  },
  async run({ $ }) {
    const options = await onedesk.propDefinitions.userType.options.call(this.onedesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
