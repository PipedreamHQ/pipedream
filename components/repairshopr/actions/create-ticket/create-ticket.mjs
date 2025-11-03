import app from "../../repairshopr.app.mjs";
import enums from "../common/enums.mjs";

export default {
  key: "repairshopr-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the docs here](https://api-docs.repairshopr.com/#/Ticket/post_tickets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    ticketTypeId: {
      type: "integer",
      label: "Ticket Type ID",
      description: "The ID of the ticket type.",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The ticket number.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the ticket. Use the format `YYYY-MM-DD`.",
      optional: true,
    },
    startAt: {
      type: "string",
      label: "Start At",
      description: "The start date of the ticket. Use the format `YYYY-MM-DDTHH:MM:SS`.",
      optional: true,
    },
    endAt: {
      type: "string",
      label: "End At",
      description: "The end date of the ticket. Use the format `YYYY-MM-DDTHH:MM:SS`.",
      optional: true,
    },
    problemType: {
      type: "string",
      label: "Problem Type",
      description: "The problem type of the ticket.",
      options: enums.TICKET_PROBLEM_TYPE,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket.",
      options: enums.TICKET_STATUS,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      customer_id: this.customerId,
      ticket_type_id: this.ticketTypeId,
      number: this.number,
      subject: this.subject,
      due_date: this.dueDate,
      start_at: this.startAt,
      end_at: this.endAt,
      problem_type: this.problemType,
      status: this.status,
    };
    const res = await this.app.createTicket(data, $);
    $.export("$summary", "Ticket successfully created");
    return res?.ticket;
  },
};
