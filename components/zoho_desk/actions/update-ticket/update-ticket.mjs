import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-ticket",
  name: "Update Ticket",
  description: "Updates an existing ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Updateaticket)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description in the ticket",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      subject,
      description,
    } = this;

    const response = await this.zohoDesk.updateTicket({
      ticketId,
      headers: {
        orgId,
      },
      data: {
        subject,
        description,
      },
    });

    $.export("$summary", `Successfully updated ticket with ID ${response.id}`);

    return response;
  },
};
