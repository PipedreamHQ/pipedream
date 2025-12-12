import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-thread-attachments",
  name: "List Thread Attachments",
  description: "List attachments for a specific thread belonging to a ticket.",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    threadId: {
      propDefinition: [
        zohoDesk,
        "threadId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
        }),
      ],
    },
    from: {
      propDefinition: [
        zohoDesk,
        "from",
      ],
    },
    limit: {
      propDefinition: [
        zohoDesk,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      threadId,
      from,
      limit,
    } = this;

    const params = {};
    if (from) params.from = from;
    if (limit) params.limit = limit;

    const response = await this.zohoDesk.getThreadAttachments({
      $,
      ticketId,
      threadId,
      headers: {
        orgId,
      },
      params,
    });

    const attachments = response.data || [];
    $.export("$summary", `Successfully retrieved ${attachments.length} attachment(s)`);

    return attachments;
  },
};
