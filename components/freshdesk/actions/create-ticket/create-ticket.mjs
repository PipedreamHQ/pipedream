import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-ticket",
  name: "Create a Ticket",
  description: "Create a ticket. [See the documentation](https://developers.freshdesk.com/api/#create_ticket)",
  version: "0.1.0",
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
      optional: true,
    },
    priority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
      ],
      default: 1,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "HTML content of the ticket",
      optional: true,
    },
    descriptionText: {
      type: "string",
      label: "Description text",
      description: "Content of the ticket in plain text",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Phone number of the contact",
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
      freshdesk, companyId, descriptionText, ...data
    } = this;
    const response = await freshdesk.createTicket({
      $,
      data: {
        company_id: Number(companyId),
        description_text: descriptionText,
        ...data,
      },
    });
    response && $.export("$summary", "Ticket successfully created");
    return response;
  },
};
