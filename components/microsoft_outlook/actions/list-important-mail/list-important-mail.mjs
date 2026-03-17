import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-important-mail",
  name: "List Important Mail",
  description: "Retrieves important (high-importance) email messages from Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
      optional: true,
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
      description: "The maximum number of important messages to return.",
    },
    includeAttachments: {
      type: "boolean",
      label: "Include Attachments",
      description: "If true, returns additional info for message attachments.",
      optional: true,
      default: false,
    },
    includeBody: {
      type: "boolean",
      label: "Include Body",
      description: "If true, includes the `body` property for each message (HTML by default per Graph API).",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const emails = [];
    const select = [
      "id",
      "subject",
      "from",
      "toRecipients",
      "ccRecipients",
      "receivedDateTime",
      "sentDateTime",
      "isRead",
      "importance",
      "conversationId",
      "webLink",
    ];

    if (this.includeBody) {
      select.push("body");
    }

    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listMessages,
      args: {
        $,
        userId: this.userId,
        params: {
          $filter: "importance eq 'high'",
          $select: select.join(","),
          ...(this.includeAttachments
            ? {
              $expand: "attachments",
            }
            : {}),
        },
      },
      max: this.maxResults,
    });

    for await (const item of items) {
      emails.push(item);
    }

    $.export("$summary", `Successfully retrieved ${emails.length} important message${emails.length === 1
      ? ""
      : "s"}.`);
    return emails;
  },
};

