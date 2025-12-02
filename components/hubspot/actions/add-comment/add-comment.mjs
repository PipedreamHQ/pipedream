import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/post-conversations-v3-conversations-threads-threadId-messages)",
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
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the comment",
    },
    fileId: {
      propDefinition: [
        hubspot,
        "fileId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createMessage({
      $,
      threadId: this.threadId,
      data: {
        type: "COMMENT",
        text: this.text,
        attachments: this.fileId
          ? [
            {
              fileId: this.fileId,
              type: "FILE",
            },
          ]
          : undefined,
      },
    });
    $.export("$summary", `Comment successfully added to thread ${this.threadId}`);
    return response;
  },
};
