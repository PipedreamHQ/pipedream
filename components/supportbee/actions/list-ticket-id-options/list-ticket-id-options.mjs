import supportbee from "../../supportbee.app.mjs";

export default {
  key: "supportbee-list-ticket-id-options",
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
    supportbee,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await supportbee.propDefinitions.ticketId.options.call(this.supportbee, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
