import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-delete-label",
  name: "Delete Label",
  description:
    "Immediately and permanently delete a user-created label from the authenticated Gmail mailbox, removing it from every message and thread it was applied to."
    + " Only user-created labels can be deleted — Gmail's built-in system labels (`INBOX`, `SENT`, `SPAM`, `TRASH`, etc.) cannot."
    + " This deletes the label *definition* itself; to merely detach a label from specific messages without removing it, use **Modify Labels** with `removeLabels` instead."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/delete).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    label: {
      type: "string",
      label: "Label ID",
      description:
        "The ID of the user-created label to permanently delete (e.g. `Label_42`)."
        + " Use the **List Labels** action to look up label IDs by name — the Gmail API deletes by ID, not by display name."
        + " System labels (`INBOX`, `SENT`, etc.) cannot be deleted.",
    },
  },
  async run({ $ }) {
    await this.gmail.deleteLabel(this.label);

    $.export("$summary", `Deleted label ${this.label}`);
    return {
      id: this.label,
      deleted: true,
    };
  },
};
