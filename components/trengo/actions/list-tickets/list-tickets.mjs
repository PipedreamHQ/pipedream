import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  key: "trengo-list-tickets",
  name: "List Tickets",
  description: "List tickets according to the specified criteria. [See the documentation](https://developers.trengo.com/reference/list-all-tickets)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "The ticket's status",
      optional: true,
      options: [
        "OPEN",
        "ASSIGNED",
        "CLOSED",
        "INVALID",
      ],
    },
    userIds: {
      propDefinition: [
        app,
        "toUserId",
      ],
      type: "integer[]",
      label: "User IDs",
      description: "Filter by one or more user IDs",
      optional: true,
    },
    channelIds: {
      propDefinition: [
        app,
        "channelId",
      ],
      type: "integer[]",
      label: "Channel IDs",
      description: "Filter by one or more channel IDs",
      optional: true,
    },
    lastMessageType: {
      type: "string",
      label: "Last Message Type",
      description: "Filter by the type of the last message",
      optional: true,
      options: [
        "INBOUND",
        "OUTBOUND",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort ascending or descending by last message date",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
      default: "DESC",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of tickets to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const tickets = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getTickets,
      resourceFnArgs: {
        params: {
          status: this.status,
          users: this.userIds,
          channels: this.channelIds,
          last_message_type: this.lastMessageType,
          sort: this.sortDirection === "ASC"
            ? "date"
            : "-date",
        },
      },
    });
    for await (const item of resourcesStream) {
      tickets.push(item);
      if (this.maxResults && tickets.length >= this.maxResults) {
        break;
      }
    }
    const length = tickets.length;
    $.export("$summary", `Successfully retrieved ${length} ticket${length === 1
      ? ""
      : "s"}`);
    return tickets;
  },
};
