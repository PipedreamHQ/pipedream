import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-get-ticket-details",
  name: "Get Ticket Details",
  description: "Retrieve details for a specified ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Tickets_Getaticket)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    ticketId: {
      propDefinition: [
        zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
    } = this;

    const response = await this.zohoDesk.getTicketDetails({
      $,
      ticketId,
      headers: {
        orgId,
      },
    });

    $.export("$summary", `Successfully retrieved ticket details for ticket ID ${ticketId}`);

    return response.data || response;
  },
};

