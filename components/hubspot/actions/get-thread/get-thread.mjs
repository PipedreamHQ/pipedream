import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-thread",
  name: "Get Thread",
  description: "Retrieves a single thread's metadata, including status, assignee, associations, and latest-message info. [See the documentation](https://developers.hubspot.com/docs/reference/api/conversations/inbox-and-messages#retrieve-threads)",
  version: "0.0.3",
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
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set to `true` to look up the thread in the archived collection. Defaults to `false` (active threads only).",
      optional: true,
    },
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
        (c) => ({
          inboxId: c.inboxId,
          channelId: c.channelId,
          archived: c.archived,
        }),
      ],
    },
    association: {
      type: "string",
      label: "Association",
      description: "Association type to include in the response. Set to `TICKET` to include the thread's associations object and associated ticket ID, if present.",
      options: [
        "TICKET",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getThread({
      $,
      threadId: this.threadId,
      params: {
        association: this.association,
        archived: this.archived,
      },
    });
    $.export("$summary", `Retrieved thread ${this.threadId}`);
    return response;
  },
};
