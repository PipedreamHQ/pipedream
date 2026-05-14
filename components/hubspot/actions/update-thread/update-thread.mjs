import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-update-thread",
  name: "Update Thread",
  description: "Updates an existing thread's status. To archive a thread, use the **Archive Thread** action; to restore an archived thread, use the **Unarchive Thread** action. HubSpot's PATCH endpoint does not support either operation via a status change. [See the documentation](https://developers.hubspot.com/docs/reference/api/conversations/inbox-and-messages#update-or-restore-threads)",
  version: "0.0.1",
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
    status: {
      type: "string",
      label: "Status",
      description: "Set to `OPEN` to reactivate a closed thread or `CLOSED` to mark it as resolved",
      options: [
        "OPEN",
        "CLOSED",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.updateThread({
      $,
      threadId: this.threadId,
      data: {
        status: this.status,
      },
    });
    $.export("$summary", `Updated thread ${this.threadId}`);
    return response;
  },
};
