import teamleader_focus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-list-user-options",
  name: "List User Options",
  description: "Retrieves available options for the User field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamleader_focus,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await teamleader_focus.propDefinitions.user.options
      .call(this.teamleader_focus, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
