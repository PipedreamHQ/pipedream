import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-messages",
  name: "List Messages",
  description: "Retrieves a list of messages in a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/get-conversations-v3-conversations-threads-threadId-messages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    inboxId: {
      propDefinition: [
        hubspot,
        "inboxId",
      ],
      optional: true,
    },
    channelId: {
      propDefinition: [
        hubspot,
        "channelId",
      ],
      optional: true,
    },
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
        (c) => ({
          inboxId: c.inboxId,
          channelId: c.channelId,
        }),
      ],
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to return only results that have been archived",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The sort direction",
      options: [
        "createdAt",
        "-createdAt",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.listMessages({
      $,
      threadId: this.threadId,
      params: {
        archived: this.archived,
        after: this.after,
        limit: this.limit,
        sort: this.sort,
      },
    });
    $.export("$summary", `Found ${response?.results?.length} message${response?.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
