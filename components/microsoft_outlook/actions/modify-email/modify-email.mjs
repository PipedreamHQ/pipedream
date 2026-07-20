import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-modify-email",
  name: "Modify Email",
  description:
    "Apply one or more state mutations to an email message: mark read/unread, add/remove categories, move to a folder, or change the flag status."
    + " All params except `messageId` are optional — only the ones you provide are applied."
    + " Use **Find Email** to obtain a message `id` before modifying."
    + " Recipes:"
    + " Mark read: `isRead: true` | Mark unread: `isRead: false`"
    + " Add category: `addCategories: [\"Follow Up\"]` | Remove category: `removeCategories: [\"Follow Up\"]`"
    + " Move to archive: `destinationFolderId: \"archive\"` | Move to inbox: `destinationFolderId: \"inbox\"`"
    + " Flag: `flagStatus: \"flagged\"` | Unflag: `flagStatus: \"notFlagged\"` | Mark complete: `flagStatus: \"complete\"`"
    + " Example: `modify-email(messageId=\"AAMk...\", isRead=true)` → marks the message as read."
    + " Example: `modify-email(messageId=\"AAMk...\", addCategories=[\"Eval-Seinfeld\"], destinationFolderId=\"archive\")` → adds a category AND moves to archive in a single call."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/message-update)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftOutlook,
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The Microsoft Graph message ID. Obtain from **Find Email** (`id` field in results).",
    },
    isRead: {
      type: "boolean",
      label: "Is Read",
      description: "`true` marks the message as read; `false` marks it as unread. Omit to leave unchanged.",
      optional: true,
    },
    addCategories: {
      type: "string[]",
      label: "Add Categories",
      description: "Category names to add to the message, e.g. `[\"Follow Up\", \"Important\"]`. Existing categories are preserved.",
      optional: true,
    },
    removeCategories: {
      type: "string[]",
      label: "Remove Categories",
      description: "Category names to remove from the message. Existing categories not listed here are preserved.",
      optional: true,
    },
    destinationFolderId: {
      type: "string",
      label: "Destination Folder ID",
      description: "Move the message to this folder. Use well-known names (`inbox`, `archive`, `deleteditems`, `drafts`, `junkemail`, `sentitems`) or a folder ID. Omit to leave in current folder.",
      optional: true,
    },
    flagStatus: {
      type: "string",
      label: "Flag Status",
      description: "Set the message flag: `flagged` (flag it), `notFlagged` (remove flag), or `complete` (mark flag as done).",
      options: [
        "flagged",
        "notFlagged",
        "complete",
      ],
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or UPN of a shared mailbox. Omit to use the authenticated user's mailbox.",
      optional: true,
    },
  },
  async run({ $ }) {
    const patchData = {};

    if (this.isRead !== undefined && this.isRead !== null) {
      patchData.isRead = this.isRead;
    }

    if (this.flagStatus) {
      patchData.flag = {
        flagStatus: this.flagStatus,
      };
    }

    if (this.addCategories?.length || this.removeCategories?.length) {
      const message = await this.microsoftOutlook.getMessage({
        userId: this.userId,
        messageId: this.messageId,
      });
      let categories = message.categories || [];
      if (this.addCategories?.length) {
        for (const cat of this.addCategories) {
          if (!categories.includes(cat)) categories.push(cat);
        }
      }
      if (this.removeCategories?.length) {
        categories = categories.filter((c) => !this.removeCategories.includes(c));
      }
      patchData.categories = categories;
    }

    let response;

    if (Object.keys(patchData).length) {
      response = await this.microsoftOutlook.updateMessage({
        userId: this.userId,
        messageId: this.messageId,
        data: patchData,
      });
    }

    if (this.destinationFolderId) {
      response = await this.microsoftOutlook.moveMessage({
        userId: this.userId,
        messageId: this.messageId,
        data: {
          destinationId: this.destinationFolderId,
        },
      });
    }

    const changes = [
      this.isRead !== undefined && this.isRead !== null
        ? `isRead=${this.isRead}`
        : null,
      this.addCategories?.length
        ? "+categories"
        : null,
      this.removeCategories?.length
        ? "-categories"
        : null,
      this.flagStatus
        ? `flag=${this.flagStatus}`
        : null,
      this.destinationFolderId
        ? `moved to ${this.destinationFolderId}`
        : null,
    ].filter(Boolean).join(", ");

    $.export("$summary", `Message updated: ${changes || "no changes"}`);
    return response || {
      messageId: this.messageId,
      updated: true,
    };
  },
};
