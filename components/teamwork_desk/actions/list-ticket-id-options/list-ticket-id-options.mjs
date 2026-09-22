import teamwork_desk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-list-ticket-id-options",
  name: "List Ticket Id Options",
  description: "Retrieves available options for the Ticket Id field.",
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
    const options = await teamwork_desk.propDefinitions.ticketId.options.call(this.teamwork_desk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
