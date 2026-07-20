import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-get-message",
  name: "Get Message",
  description:
    "Fetch a single email message by its Microsoft Graph message ID, including full body and optional attachments."
    + " Use **Find Email** first to search for messages and obtain a message `id`; then call this tool to retrieve the full content."
    + " Set `includeAttachments: true` to expand attachment metadata — the `id` field of each attachment is required by **Download Attachment**."
    + " Example: after `find-email(search=\"Eval-Festivus\")` returns a message with `id: \"AAMk...\"`, call `get-message(messageId=\"AAMk...\", includeAttachments=true)` to get the body text and attachment list."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-get)",
  version: "0.0.5",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The Microsoft Graph message ID. Obtain this from **Find Email** (`id` field in results).",
    },
    includeAttachments: {
      type: "boolean",
      label: "Include Attachments",
      description: "When `true`, expands attachment metadata. Each attachment will have an `id` needed by **Download Attachment**.",
      optional: true,
      default: false,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or UPN of a shared mailbox. Omit to use the authenticated user's mailbox.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = this.includeAttachments
      ? {
        $expand: "attachments",
      }
      : {};

    const message = await this.microsoftOutlook.getMessage({
      userId: this.userId,
      messageId: this.messageId,
      params,
    });

    const subject = message?.subject ?? "(no subject)";
    $.export("$summary", `Retrieved message: "${subject}"`);
    return message;
  },
};
