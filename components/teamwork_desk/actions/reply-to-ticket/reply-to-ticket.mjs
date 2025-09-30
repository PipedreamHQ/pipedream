import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-reply-to-ticket",
  name: "Reply To Ticket",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Reply to a specific ticket [See the documentation](https://apidocs.teamwork.com/docs/desk/0f3315d9a0762-reply-to-ticket)",
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
    statusId: {
      propDefinition: [
        teamworkDesk,
        "statusId",
      ],
    },
    threadType: {
      propDefinition: [
        teamworkDesk,
        "threadType",
      ],
    },
    message: {
      propDefinition: [
        teamworkDesk,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const {
      teamworkDesk,
      ticketId,
      statusId,
      ...data
    } = this;

    const response = await teamworkDesk.createCustomerReply({
      $,
      ticketId,
      data: {
        ...data,
        status: {
          id: statusId,
        },
      },
    });

    $.export("$summary", `A new customer reply with Id: ${response.ticket?.id} was successfully created!`);
    return response;
  },
};
