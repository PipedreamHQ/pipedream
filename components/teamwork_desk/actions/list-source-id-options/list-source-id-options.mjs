import teamwork_desk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-list-source-id-options",
  name: "List Source Id Options",
  description: "Retrieves available options for the Source Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamwork_desk,
    page: {
      propDefinition: [
        teamwork_desk,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await teamwork_desk.propDefinitions.sourceId.options.call(this.teamwork_desk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
