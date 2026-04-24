import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-labels",
  name: "List Labels",
  description:
    "List every label in the authenticated user's mailbox (system labels like `INBOX`, `SENT`, `TRASH`, `STARRED`, `UNREAD` and user-created labels)."
    + " Call this before **Modify Labels** or **Find Emails** when you need to target a label that the user named rather than an obvious system label — it resolves a name like `Clients/Acme` to its opaque label ID."
    + " User labels are returned first, then system labels."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.labels/list).",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
  },
  async run({ $ }) {
    const resp = await this.gmail.listLabels();
    $.export("$summary", `Successfully retrieved ${resp.labels.length} labels`);
    return resp;
  },
};
