import mojoHelpdesk from "../../mojo_helpdesk.app.mjs";

export default {
  key: "mojo_helpdesk-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the docs here](https://github.com/mojohelpdesk/mojohelpdesk-api-doc#create-ticket)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mojoHelpdesk,
    ticketQueueId: {
      propDefinition: [
        mojoHelpdesk,
        "ticketQueueId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The content of the new ticket",
    },
    priorityId: {
      propDefinition: [
        mojoHelpdesk,
        "priorityId",
      ],
    },
    userId: {
      propDefinition: [
        mojoHelpdesk,
        "userId",
      ],
    },
    dueOn: {
      type: "string",
      label: "Due On",
      description: "Date the ticket is due on in ISO Format",
      optional: true,
    },
    scheduledOn: {
      type: "string",
      label: "Scheduled On",
      description: "Date the ticket is scheduled on in ISO Format",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ticket_queue_id: this.ticketQueueId,
      title: this.title,
      description: this.description,
      priority_id: this.priorityId,
      assigned_to_id: this.userId,
      due_on: this.dueOn,
      scheduled_on: this.scheduledOn,
    };

    const response = await this.mojoHelpdesk.createTicket({
      data,
      $,
    });

    $.export("$summary", `Successfully created ticket with ID ${response.id}`);

    return response;
  },
};
