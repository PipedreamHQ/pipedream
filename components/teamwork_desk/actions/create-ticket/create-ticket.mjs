import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-create-ticket",
  name: "Create Ticket",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new ticket [See the documentation](https://apidocs.teamwork.com/docs/desk/fe69a0fb1007a-create-a-new-customer)",
  type: "action",
  props: {
    teamworkDesk,
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
      customerId,
      inboxId,
      priorityId,
      sourceId,
      statusId,
      tagIds,
      typeId,
      ...data
    } = this;

    const response = await teamworkDesk.createTicket({
      $,
      data: {
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
    });

    $.export("$summary", `A new ticket with Id: ${response.ticket?.id} was successfully created!`);
    return response;
  },
};
