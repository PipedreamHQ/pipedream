import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-role-ids-options",
  name: "List Role IDs Options",
  description: "Retrieves available options for the Role IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
  },
  async run({ $ }) {
    const options = await freshdesk.propDefinitions.roleIds.options.call(this.freshdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
