import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-archive-thread",
  name: "Archive Thread",
  description: "Archives a thread (soft delete). The thread is hidden from active views but can be restored via the HubSpot UI or by listing archived threads. [See the documentation](https://developers.hubspot.com/docs/reference/api/conversations/inbox-and-messages#archive-threads)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
  },
  async run({ $ }) {
    const response = await this.hubspot.archiveThread({
      $,
      threadId: this.threadId,
    });
    $.export("$summary", `Archived thread ${this.threadId}`);
    return response;
  },
};
