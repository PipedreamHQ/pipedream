import connectwise from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket in Connectwise. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Tickets/postServiceTickets)",
  version: "0.0.1",
  type: "action",
  props: {
    connectwise,
    summary: {
      type: "string",
      label: "Summary",
      description: "The subject line or description line for the ticket",
    },
    company: {
      propDefinition: [
        connectwise,
        "company",
      ],
    },
    contact: {
      propDefinition: [
        connectwise,
        "contact",
      ],
    },
    priority: {
      propDefinition: [
        connectwise,
        "priority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.connectwise.createTicket({
      $,
      data: {
        summary: this.summary,
        company: {
          id: this.company,
        },
        contact: this.contact
          ? {
            id: this.contact,
          }
          : undefined,
        priority: this.priority
          ? {
            id: this.priority,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully created ticket with ID: ${response.id}`);
    return response;
  },
};
