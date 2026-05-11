import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-unarchive-thread",
  name: "Unarchive Thread",
  description: "Restores a previously-archived thread, returning it to the active inbox. Sends `PATCH` with body `{ archived: false }`, the only restore path HubSpot's API supports. The Thread ID dropdown lists archived threads. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/patch-conversations-v3-conversations-threads-threadId)",
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
          archived: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.updateThread({
      $,
      threadId: this.threadId,
      params: {
        archived: true,
      },
      data: {
        archived: false,
      },
    });
    $.export("$summary", `Unarchived thread ${this.threadId}`);
    return response;
  },
};
