import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#102-create-a-ticket)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    contact: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
      description: "Ticket contact",
    },
    email: {
      propDefinition: [
        agileCrm,
        "contactEmail",
        (c) => ({
          contactId: c.contact,
        }),
      ],
    },
    subject: {
      propDefinition: [
        agileCrm,
        "subject",
      ],
      description: "Subject of the ticket",
    },
    priority: {
      propDefinition: [
        agileCrm,
        "ticketPriority",
      ],
    },
    status: {
      propDefinition: [
        agileCrm,
        "ticketStatus",
      ],
    },
    message: {
      propDefinition: [
        agileCrm,
        "message",
      ],
    },
    group: {
      propDefinition: [
        agileCrm,
        "group",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.agileCrm.getContact({
      contactId: this.contact,
      $,
    });
    const name = (contact.properties.find((prop) => prop.name === "first_name")).value;
    const data = {
      requester_name: name,
      requester_email: this.email,
      subject: this.subject,
      priority: this.priority,
      status: this.status,
      groupID: this.group || 1,
      html_text: this.message,
    };

    const response = await this.agileCrm.createTicket({
      data,
      $,
    });

    $.export("$summary", `Successfully created ticket with ID ${response.id}`);

    return response;
  },
};
