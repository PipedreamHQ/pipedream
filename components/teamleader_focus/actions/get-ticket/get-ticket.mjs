import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-get-ticket",
  name: "Get Ticket",
  description: "Get details for a single ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-info)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const {
      teamleaderFocus,
      ticketId,
    } = this;

    const response = await teamleaderFocus.getTicket({
      $,
      data: {
        id: ticketId,
      },
    });
    $.export("$summary", `Successfully retrieved ticket with ID ${ticketId}`);
    return response;
  },
};
