import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-modify-labels",
  name: "Modify Labels",
  description:
    "Add and/or remove labels on one or more Gmail messages in a single call."
    + " In Gmail, most inbox-state operations are label mutations under the hood, so this one tool covers archive / trash / untrash / star / unstar / mark-read / mark-unread / apply-label / remove-label."
    + "\n\n**Use this whenever the user asks you to star, unstar, flag, archive, file, sort, label, tag, categorise, move, trash, delete, restore, or mark mail as read or unread** — there is no separate tool for any of those. Pair it with **Find Emails** to turn a description of the mail (\"the invoice from billing\", \"everything from last week\") into the `messageIds` this tool needs."
    + " Apply it even when some messages already carry the target state: the operation is idempotent, and the user asked for an outcome, not a diff."
    + "\n\n**Do NOT use this to set up filters, rules, or any automation that applies to mail that has not arrived yet.** This tool labels messages that already exist, one batch at a time. Gmail filters, auto-forwarding, and the vacation responder are settings-level features with no action in this set — if the user asks to \"automatically label incoming mail\", \"skip the inbox from now on\", or \"set up a rule\", say so outright rather than gathering criteria you cannot act on, and point them at Gmail's own settings."
    + "\n\n⚠️ **Trashing is destructive — confirm before you do it.** Adding `TRASH` removes mail from the mailbox, and nothing in this tool set can permanently delete or restore in bulk beyond untrashing. When the request would trash mail the user did not enumerate individually (\"trash everything from X\", \"clear out this label\", \"delete the old ones\"), first say how many messages match and what they are, and get explicit confirmation. Every other operation here is safely reversible and needs no confirmation."
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
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
