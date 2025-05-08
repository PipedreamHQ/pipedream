import app from "../../ninjaone.app.mjs";

export default {
  key: "ninjaone-create-ticket",
  name: "Create Ticket",
  description: "Create a new support ticket in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/ticketing/create).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    clientId: {
      label: "Client ID",
      description: "The identifier of the client. Organization identifier.",
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    ticketFormId: {
      propDefinition: [
        app,
        "ticketFormId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket. Eg. `CPU with problems`.",
    },
    status: {
      propDefinition: [
        app,
        "ticketStatus",
      ],
    },
    type: {
      type: "string",
      label: "Ticket Type",
      description: "The type of the ticket.",
      optional: true,
      options: [
        "PROBLEM",
        "QUESTION",
        "INCIDENT",
        "TASK",
      ],
    },
    assignedAppUserId: {
      propDefinition: [
        app,
        "assignedAppUserId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the support ticket",
      optional: false,
    },
    isDescriptionPublic: {
      type: "boolean",
      label: "Description Public",
      description: "Whether the description of the ticket is public.",
      optional: true,
    },
    parentTicketId: {
      type: "string",
      label: "Parent Ticket ID",
      description: "The identifier of the parent ticket.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Ticket Priority",
      description: "The priority of the ticket",
      optional: true,
      options: [
        "NONE",
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
    },
  },
  methods: {
    createTicket(args = {}) {
      return this.app.post({
        path: "/ticketing/ticket",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTicket,
      clientId,
      ticketFormId,
      subject,
      status,
      type,
      assignedAppUserId,
      description,
      // isDescriptionPublic,
      parentTicketId,
      priority,
    } = this;

    const response = await createTicket({
      $,
      data: {
        clientId,
        ticketFormId,
        subject,
        status,
        type,
        assignedAppUserId,
        description,
        // isDescriptionPublic,
        parentTicketId,
        priority,
      },
    });

    $.export("$summary", "Successfully created ticket.");

    return response;
  },
};
