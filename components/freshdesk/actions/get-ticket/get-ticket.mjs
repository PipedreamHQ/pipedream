import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-ticket",
  name: "Get Ticket Details",
  description: "Get details of a Ticket. [See the documentation](https://developers.freshdesk.com/api/#view_a_ticket)",
  version: "0.1.1",
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const {
      freshdesk, ticketId,
    } = this;
    const response = await freshdesk.getTicket({
      $,
      ticketId,
    });
    response && $.export("$summary", "Successfully retrieved ticket");
    return response;
  },
};
