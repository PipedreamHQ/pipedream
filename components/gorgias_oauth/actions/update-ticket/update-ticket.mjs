import { parseObject } from "../../common/utils.mjs";
import gorgiasOauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-update-ticket",
  name: "Update Ticket",
  description: "Updates a predefined ticket in the Gorgias system. [See the documentation](https://developers.gorgias.com/reference/update-ticket)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgiasOauth,
    ticketId: {
      propDefinition: [
        gorgiasOauth,
        "ticketId",
      ],
    },
    assigneeTeamId: {
      propDefinition: [
        gorgiasOauth,
        "assigneeTeamId",
      ],
      optional: true,
    },
    assigneeUserId: {
      propDefinition: [
        gorgiasOauth,
        "userId",
      ],
      optional: true,
    },
    channel: {
      propDefinition: [
        gorgiasOauth,
        "channel",
      ],
    },
    closedDatetime: {
      type: "string",
      label: "Closed Datetime",
      description: "When the ticket was closed (ISO 8601 format)",
      optional: true,
    },
    customerId: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
      optional: true,
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email of the customer linked to the ticket",
      optional: true,
    },
    externalId: {
      propDefinition: [
        gorgiasOauth,
        "externalId",
      ],
    },
    fromAgent: {
      type: "boolean",
      label: "From Agent",
      description: "Whether the first message of the ticket was sent by your company to a customer, or the opposite",
      optional: true,
    },
    isUnread: {
      type: "boolean",
      label: "Is Unread",
      description: "Whether the ticket is unread for you",
      optional: true,
    },
    language: {
      propDefinition: [
        gorgiasOauth,
        "language",
      ],
    },
    spam: {
      type: "boolean",
      label: "Spam",
      description: "Whether the ticket is considered as spam or not",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket. Default: `open`",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    subject: {
      propDefinition: [
        gorgiasOauth,
        "subject",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags linked to the ticket",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gorgiasOauth.updateTicket({
      $,
      ticketId: this.ticketId,
      data: {
        assignee_team: this.assigneeTeamId
          ? {
            id: this.assigneeTeamId,
          }
          : undefined,
        assignee_user: this.assigneeUserId
          ? {
            id: this.assigneeUserId,
          }
          : undefined,
        channel: this.channel,
        closed_datetime: this.closedDatetime,
        customer: this.customerId
          ? {
            id: this.customerId,
            email: this.customerEmail,
          }
          : undefined,
        external_id: this.externalId,
        from_agent: this.fromAgent,
        is_unread: this.isUnread,
        language: this.language,
        spam: this.spam,
        status: this.status,
        subject: this.subject,
        tags: this.tags
          ? parseObject(this.tags)?.map((tag) => ({
            name: tag,
          }))
          : undefined,
      },
    });

    $.export("$summary", `Successfully updated ticket with ID ${this.ticketId}`);
    return response;
  },
};
