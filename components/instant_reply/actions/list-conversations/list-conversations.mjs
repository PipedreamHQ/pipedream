import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-list-conversations",
  name: "List Conversations",
  description: "Return a list of conversations from your Instant Reply inbox. Filter by status, channel, or assignee. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    status: {
      type: "string",
      label: "Status",
      description: "Filter conversations by status",
      options: ["active", "closed", "pending"],
      optional: true,
    },
    channel: {
      propDefinition: [
        instantReply,
        "channel",
      ],
      optional: true,
      description: "Filter to a specific channel. Leave blank for all channels.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of conversations to return (1–100)",
      default: 20,
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantReply.listConversations({
      $,
      params: {
        status: this.status || undefined,
        platform: this.channel || undefined,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved ${(response?.data ?? []).length} conversations`);
    return response;
  },
};
