import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-ticket",
  name: "Create a Ticket",
  description: "Create a ticket. [See the documentation](https://developers.freshdesk.com/api/#create_ticket)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    companyId: {
      propDefinition: [
        freshdesk,
        "companyId",
      ],
    },
    email: {
      propDefinition: [
        freshdesk,
        "contactEmail",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    priority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
      ],
      default: 1,
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "HTML content of the ticket",
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Phone number of the requester. If no contact exists with this phone number on Freshdesk, it will be added as a new contact",
      optional: true,
    },
    status: {
      propDefinition: [
        freshdesk,
        "ticketStatus",
      ],
      default: 2,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshdesk, companyId, ...data
    } = this;
    const response = await freshdesk.createTicket({
      $,
      data: {
        company_id: Number(companyId),
        ...data,
      },
    });
    response && $.export("$summary", "Ticket successfully created");
    return response;
  },
};
