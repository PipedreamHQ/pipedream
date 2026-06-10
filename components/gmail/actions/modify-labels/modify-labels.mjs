import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-modify-labels",
  name: "Modify Labels",
  description:
    "Add and/or remove labels on one or more Gmail messages in a single call."
    + " In Gmail, most inbox-state operations are label mutations under the hood, so this one tool covers archive / trash / untrash / star / unstar / mark-read / mark-unread / apply-label / remove-label."
    + "\n\nCommon recipes (pass these in `addLabels` / `removeLabels`):"
    + "\n- **Archive** → `removeLabels: [\"INBOX\"]`"
    + "\n- **Move to trash** → `addLabels: [\"TRASH\"]`"
    + "\n- **Untrash (restore)** → `removeLabels: [\"TRASH\"]`, `addLabels: [\"INBOX\"]`"
    + "\n- **Star** → `addLabels: [\"STARRED\"]`"
    + "\n- **Unstar** → `removeLabels: [\"STARRED\"]`"
    + "\n- **Mark read** → `removeLabels: [\"UNREAD\"]`"
    + "\n- **Mark unread** → `addLabels: [\"UNREAD\"]`"
    + "\n- **Apply a user label** → `addLabels: [\"Clients/Acme\"]` (pass the name or the label ID)"
    + "\n- **Apply user label AND archive** → `addLabels: [\"Clients/Acme\"]`, `removeLabels: [\"INBOX\"]`"
    + "\n\n`addLabels` and `removeLabels` accept either raw label IDs (system labels like `INBOX`, `STARRED`, `UNREAD`, `TRASH`) or user-visible label names — names are resolved via **List Labels** before the API call."
    + " Use **Create Label** first if you need to apply a brand-new label that doesn't yet exist."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    messageIds: {
      type: "string[]",
      label: "Message IDs",
      description: "Message IDs to modify (up to 1000 per request). Obtain these from **Find Emails**.",
    },
    addLabels: {
      type: "string[]",
      label: "Labels to Add",
      description:
        "Labels to add to every message. Accepts label IDs (e.g. `STARRED`, `INBOX`) or user-visible label names (e.g. `Clients/Acme`) — names are resolved server-side.",
      optional: true,
    },
    removeLabels: {
      type: "string[]",
      label: "Labels to Remove",
      description:
        "Labels to remove from every message. Accepts label IDs or user-visible names. To archive, remove `INBOX`; to mark read, remove `UNREAD`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const addLabels = this.addLabels ?? [];
    const removeLabels = this.removeLabels ?? [];
    if (!this.messageIds?.length) {
      throw new Error("`messageIds` must contain at least one message ID.");
    }
    if (!addLabels.length && !removeLabels.length) {
      throw new Error("At least one of `addLabels` or `removeLabels` must be non-empty.");
    }

    const { labels = [] } = await this.gmail.listLabels();
    const byName = new Map(labels.map((l) => [
      l.name,
      l.id,
    ]));
    const byId = new Set(labels.map((l) => l.id));
    const resolve = (l) => {
      if (!l) return l;
      if (byId.has(l)) return l;
      return byName.get(l) ?? l;
    };
    const addLabelIds = addLabels.map(resolve);
    const removeLabelIds = removeLabels.map(resolve);

    await this.gmail._client().users.messages.batchModify({
      userId: constants.USER_ID,
      requestBody: {
        ids: this.messageIds,
        addLabelIds,
        removeLabelIds,
      },
    });

    const added = addLabelIds.length
      ? ` +[${addLabelIds.join(", ")}]`
      : "";
    const removed = removeLabelIds.length
      ? ` -[${removeLabelIds.join(", ")}]`
      : "";
    $.export("$summary", `Modified ${this.messageIds.length} message${this.messageIds.length === 1
      ? ""
      : "s"}:${added}${removed}`);

    return {
      messageIds: this.messageIds,
      addLabelIds,
      removeLabelIds,
    };
  },
};
