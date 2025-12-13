import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-send-email-reply",
  name: "Send E-Mail Reply",
  description: "Sends an email reply. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_SendEmailReply)",
  type: "action",
  version: "0.0.8",
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
    status: {
      propDefinition: [
        zohoDesk,
        "ticketStatus",
      ],
      description: "Type of ticket resolution status to set after sending the email reply",
      optional: true,
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
      status,
    } = this;

    const data = {
      fromEmailAddress,
      to,
      channel: "EMAIL",
      isForward: "true",
    };

    // Add optional fields
    if (content) data.content = content;
    if (contentType) data.contentType = contentType;
    if (status) data.ticketStatus = status;

    const response = await this.zohoDesk.sendReply({
      ticketId,
      headers: {
        orgId,
      },
      data,
    });

    $.export("$summary", `Successfully sent email reply with ID ${response.id}`);

    return response;
  },
};
