import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-update-ticket",
  name: "Update Ticket",
  description: "Updates an existing ticket. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Updateaticket)",
  type: "action",
  version: "0.0.8",
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
      optional: true,
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
      ticketId,
      subject,
      description,
      status,
      priority,
      assigneeId,
      departmentId,
      contactId,
      channel,
      classification,
      category,
      subCategory,
      dueDate,
      productId,
    } = this;

    const data = {};

    // Add optional fields
    if (subject) data.subject = subject;
    if (description) data.description = description;
    if (status) data.status = status;
    if (priority) data.priority = priority;
    if (assigneeId) data.assigneeId = assigneeId;
    if (departmentId) data.departmentId = departmentId;
    if (contactId) data.contactId = contactId;
    if (channel) data.channel = channel;
    if (classification) data.classification = classification;
    if (category) data.category = category;
    if (subCategory) data.subCategory = subCategory;
    if (dueDate) data.dueDate = dueDate;
    if (productId) data.productId = productId;

    const response = await this.zohoDesk.updateTicket({
      ticketId,
      headers: {
        orgId,
      },
      data,
    });

    $.export("$summary", `Successfully updated ticket with ID ${response.id}`);

    return response;
  },
};
