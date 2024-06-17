import gorgiasOauth from "../../gorgias_oauth.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gorgias_oauth-update-ticket",
  name: "Update Ticket",
  description: "Updates a predefined ticket in the Gorgias system. [See the documentation](https://developers.gorgias.com/reference/update-ticket)",
  version: "0.0.{{ts}}",
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
    },
    assigneeUserId: {
      propDefinition: [
        gorgiasOauth,
        "assigneeUserId",
      ],
    },
    channel: {
      propDefinition: [
        gorgiasOauth,
        "channel",
      ],
    },
    closedDatetime: {
      propDefinition: [
        gorgiasOauth,
        "closedDatetime",
      ],
    },
    customerId: {
      propDefinition: [
        gorgiasOauth,
        "customerId",
      ],
    },
    customerEmail: {
      propDefinition: [
        gorgiasOauth,
        "customerEmail",
      ],
    },
    externalId: {
      propDefinition: [
        gorgiasOauth,
        "externalId",
      ],
    },
    fromAgent: {
      propDefinition: [
        gorgiasOauth,
        "fromAgent",
      ],
    },
    isUnread: {
      propDefinition: [
        gorgiasOauth,
        "isUnread",
      ],
    },
    language: {
      propDefinition: [
        gorgiasOauth,
        "language",
      ],
    },
    spam: {
      propDefinition: [
        gorgiasOauth,
        "spam",
      ],
    },
    status: {
      propDefinition: [
        gorgiasOauth,
        "status",
      ],
    },
    subject: {
      propDefinition: [
        gorgiasOauth,
        "subject",
      ],
    },
    tags: {
      propDefinition: [
        gorgiasOauth,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const data = {
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
        ? this.tags.map((tag) => ({
          name: tag,
        }))
        : undefined,
    };

    const response = await this.gorgiasOauth.updateTicket({
      ticketId: this.ticketId,
      ...data,
    });

    $.export("$summary", `Successfully updated ticket with ID ${this.ticketId}`);
    return response;
  },
};
