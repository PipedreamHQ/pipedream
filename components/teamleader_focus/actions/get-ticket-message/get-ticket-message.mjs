import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-get-ticket-message",
  name: "Get Ticket Message",
  description: "Get a single message for a single ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-get-message)",
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
    messageId: {
      propDefinition: [
        teamleaderFocus,
        "messageId",
        ({ ticketId }) => ({
          ticketId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      teamleaderFocus,
      ticketId,
      messageId,
    } = this;

    const { data: response } = await teamleaderFocus.getTicketMessage({
      $,
      data: {
        message_id: messageId,
      },
    });
    $.export("$summary", `Successfully retrieved message with ID ${messageId} for ticket with ID ${ticketId}`);
    return response;
  },
};
