import ninjaone from "../../ninjaone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ninjaone-create-ticket",
  name: "Create Support Ticket",
  description: "Creates a new support ticket in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ninjaone,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the support ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the support ticket",
    },
    priority: {
      propDefinition: [
        ninjaone,
        "ticketPriority",
      ],
    },
    assignedTechnician: {
      propDefinition: [
        ninjaone,
        "technician",
      ],
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date for the support ticket. Format: YYYY-MM-DD",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ninjaone.createSupportTicket({
      title: this.title,
      description: this.description,
      priority: this.priority,
      assignedTechnician: this.assignedTechnician,
      dueDate: this.dueDate,
    });

    $.export("$summary", `Ticket created successfully with ID ${response.id}`);
    return response;
  },
};
