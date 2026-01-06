import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket in your helpdesk. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Createaticket)",
  type: "action",
  version: "0.0.9",
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
    status: {
      propDefinition: [
        zohoDesk,
        "ticketStatus",
      ],
    },
    priority: {
      propDefinition: [
        zohoDesk,
        "ticketPriority",
      ],
    },
    assigneeId: {
      propDefinition: [
        zohoDesk,
        "assigneeId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    channel: {
      propDefinition: [
        zohoDesk,
        "channel",
      ],
    },
    classification: {
      propDefinition: [
        zohoDesk,
        "classification",
      ],
    },
    category: {
      propDefinition: [
        zohoDesk,
        "category",
      ],
    },
    subCategory: {
      propDefinition: [
        zohoDesk,
        "subCategory",
      ],
    },
    dueDate: {
      propDefinition: [
        zohoDesk,
        "dueDate",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for the ticket",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number for the ticket",
      optional: true,
    },
    productId: {
      propDefinition: [
        zohoDesk,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      departmentId,
      contactId,
      subject,
      description,
      status,
      priority,
      assigneeId,
      channel,
      classification,
      category,
      subCategory,
      dueDate,
      email,
      phone,
      productId,
    } = this;

    const data = {
      departmentId,
      contactId,
      subject,
    };

    // Add optional fields
    if (description) data.description = description;
    if (status) data.status = status;
    if (priority) data.priority = priority;
    if (assigneeId) data.assigneeId = assigneeId;
    if (channel) data.channel = channel;
    if (classification) data.classification = classification;
    if (category) data.category = category;
    if (subCategory) data.subCategory = subCategory;
    if (dueDate) data.dueDate = dueDate;
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (productId) data.productId = productId;

    const response = await this.zohoDesk.createTicket({
      headers: {
        orgId,
      },
      data,
    });

    $.export("$summary", `Successfully created a new ticket with ID ${response.id}`);

    return response;
  },
};
