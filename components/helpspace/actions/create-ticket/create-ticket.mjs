import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket in Helpspace",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpspace,
    ticketTitle: {
      type: "string",
      label: "Ticket Title",
      description: "Title of the ticket",
      optional: false,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the ticket",
      optional: false,
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "Attachment for the ticket",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category of the ticket",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpspace.createTicket({
      data: {
        title: this.ticketTitle,
        description: this.description,
        attachment: this.attachment,
        category: this.category,
      },
    });
    $.export("$summary", `Successfully created ticket with ID: ${response.id}`);
    return response;
  },
};
