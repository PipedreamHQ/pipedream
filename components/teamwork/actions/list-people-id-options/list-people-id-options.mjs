import teamwork from "../../teamwork.app.mjs";

export default {
  key: "teamwork-list-people-id-options",
  name: "List People Id Options",
  description: "Retrieves available options for the People Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamwork,
    page: {
      propDefinition: [
        teamwork,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await teamwork.propDefinitions.peopleId.options.call(this.teamwork, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
