import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-inboxes",
  name: "List Inboxes",
  description: "Retrieves a list of inboxes. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-inbox/get-conversations-v3-conversations-inboxes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    after: {
      type: "string",
      label: "After",
      description: "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to include archived inboxes in the response",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.listInboxes({
      $,
      params: {
        after: this.after,
        archived: this.archived,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.results?.length} inbox${response?.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
