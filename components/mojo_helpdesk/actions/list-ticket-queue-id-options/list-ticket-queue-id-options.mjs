import mojo_helpdesk from "../../mojo_helpdesk.app.mjs";

export default {
  key: "mojo_helpdesk-list-ticket-queue-id-options",
  name: "List Ticket Queue Options",
  description: "Retrieves available options for the Ticket Queue field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mojo_helpdesk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await mojo_helpdesk.propDefinitions.ticketQueueId.options
      .call(this.mojo_helpdesk, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
