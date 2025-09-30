import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-update-ticket",
  name: "Update Ticket",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific ticket [See the documentation](https://apidocs.teamwork.com/docs/desk/4de711efd2f09-update-multiple-tickets)",
  type: "action",
  props: {
    teamworkDesk,
    ticketId: {
      propDefinition: [
        teamworkDesk,
        "ticketId",
      ],
    },
    bcc: {
      propDefinition: [
        teamworkDesk,
        "bcc",
      ],
      optional: true,
    },
    cc: {
      propDefinition: [
        teamworkDesk,
        "cc",
      ],
      optional: true,
    },
    customerId: {
      propDefinition: [
        teamworkDesk,
        "customerId",
      ],
      withLabel: true,
    },
    inboxId: {
      propDefinition: [
        teamworkDesk,
        "inboxId",
      ],
    },
    message: {
      propDefinition: [
        teamworkDesk,
        "message",
      ],
    },
    notifyCustomer: {
      propDefinition: [
        teamworkDesk,
        "notifyCustomer",
      ],
    },
    priorityId: {
      propDefinition: [
        teamworkDesk,
        "priorityId",
      ],
    },
    sourceId: {
      propDefinition: [
        teamworkDesk,
        "sourceId",
      ],
    },
    statusId: {
      propDefinition: [
        teamworkDesk,
        "statusId",
      ],
    },
    subject: {
      propDefinition: [
        teamworkDesk,
        "subject",
      ],
    },
    tagIds: {
      propDefinition: [
        teamworkDesk,
        "tagIds",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        teamworkDesk,
        "typeId",
      ],
    },
  },
  async run({ $ }) {
    const {
      teamworkDesk,
      ticketId,
      customerId,
      inboxId,
      priorityId,
      sourceId,
      statusId,
      tagIds,
      typeId,
      ...data
    } = this;

    const response = await teamworkDesk.updateTicket({
      $,
      ticketId,
      data: {
        ticket: {
          ...data,
          customer: {
            email: customerId.label,
            id: customerId.value,
          },
          inbox: {
            id: inboxId,
          },
          priority: {
            id: priorityId,
          },
          source: {
            id: sourceId,
          },
          status: {
            id: statusId,
          },
          tags: tagIds && tagIds.map((tag) => ({
            id: tag,
          })),
          type: {
            id: typeId,
          },
        },
      },
    });

    $.export("$summary", `The ticket with Id: ${ticketId} was successfully updated!`);
    return response;
  },
};
