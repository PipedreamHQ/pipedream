import teamwork_desk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-list-inbox-id-options",
  name: "List Inbox ID Options",
  description: "Retrieves available options for the Inbox ID field.",
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
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await teamwork_desk.propDefinitions.inboxId.options.call(this.teamwork_desk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
