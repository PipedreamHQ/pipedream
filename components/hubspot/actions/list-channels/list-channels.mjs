import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-channels",
  name: "List Channels",
  description: "Retrieves a list of channels. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-channel/get-conversations-v3-conversations-channels)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.listChannels({
      $,
      params: {
        after: this.after,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.results?.length} channel${response?.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
