import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-list-conversation-id-options",
  name: "List Ticket ID Options",
  description: "Retrieves available options for the Ticket ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    richpanel,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await richpanel.propDefinitions.conversationId.options.call(this.richpanel, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
