import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket in your helpdesk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Createaticket)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
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
    departmentId: {
      propDefinition: [
        zohoDesk,
        "departmentId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    contactId: {
      propDefinition: [
        zohoDesk,
        "contactId",
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
      departmentId,
      contactId,
      subject,
      description,
    } = this;

    const response = await this.zohoDesk.createTicket({
      headers: {
        orgId,
      },
      data: {
        departmentId,
        contactId,
        subject,
        description,
      },
    });

    $.export("$summary", `Successfully created a new ticket with ID ${response.id}`);

    return response;
  },
};
