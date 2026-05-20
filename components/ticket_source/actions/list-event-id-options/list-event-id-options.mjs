import ticket_source from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-list-event-id-options",
  name: "List Event ID Options",
  description: "Retrieves available options for the Event ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ticket_source,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ticket_source.propDefinitions.eventId.options.call(this.ticket_source, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
