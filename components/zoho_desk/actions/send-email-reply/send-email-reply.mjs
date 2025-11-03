import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-send-email-reply",
  name: "Send E-Mail Reply",
  description: "Sends an email reply. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_SendEmailReply)",
  type: "action",
  version: "0.0.6",
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
    ticketId: {
      propDefinition: [
        zohoDesk,
        "ticketId",
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
    fromEmailAddress: {
      label: "From Email Address",
      description: "Mandatory parameter for creating an email thread.",
      propDefinition: [
        zohoDesk,
        "supportEmailAddress",
        ({
          orgId,
          departmentId,
        }) => ({
          orgId,
          departmentId,
        }),
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "To email ID in the thread",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Formatting type of the content. Values supported are `html` and `plainText` (default).",
      optional: true,
      options: [
        "html",
        "plainText",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the thread",
      optional: true,
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "Type of ticket resolution status. The values supported are `OPEN` and `ON HOLD` and `CLOSED`.",
      optional: true,
      options: [
        "OPEN",
        "ON HOLD",
        "CLOSED",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      fromEmailAddress,
      to,
      content,
      contentType,
      ticketStatus,
    } = this;

    const response = await this.zohoDesk.sendReply({
      ticketId,
      headers: {
        orgId,
      },
      data: {
        fromEmailAddress,
        to,
        content,
        contentType,
        ticketStatus,
        channel: "EMAIL",
        isForward: "true",
      },
    });

    $.export("$summary", `Successfully sent email reply with ID ${response.id}`);

    return response;
  },
};
