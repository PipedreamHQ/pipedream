import app from "../../google_chat.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "google_chat-list-messages",
  name: "List Messages",
  description: "Lists messages in a space that the caller is a member of, including messages from blocked members and spaces. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.messages/list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The maximum number of messages returned. If unspecified, at most 25 are returned.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "A page token received from a previous list messages call. Provide this parameter to retrieve the subsequent page.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Specify how the list of messages is ordered. The default ordering is createTime ASC.",
      optional: true,
      options: constants.LIST_MESSAGES_ORDER_BY_OPTIONS,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Specify a query filter by date and thread name. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.messages/list#query-parameters)",
      optional: true,
    },
    showDeleted: {
      type: "boolean",
      label: "Show Deleted",
      description: "Whether to include deleted messages. Deleted messages include deleted time and metadata about their deletion, but message content is unavailable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listMessages({
      $,
      spaceId: this.spaceId,
      params: {
        showDeleted: this.showDeleted,
        filter: this.filter,
        orderBy: this.orderBy,
        pageSize: this.pageSize,
        pageToken: this.pageToken,
      },
    });
    $.export("$summary", `Successfully fetched ${response.messages.length} messages`);
    return response;
  },
};
