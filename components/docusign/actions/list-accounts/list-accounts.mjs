import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-list-accounts",
  name: "List Accounts",
  description: "List the DocuSign accounts available to the connected user. Use this to find the **Account** ID required by other actions when the connected user belongs to more than one account. [See the documentation](https://developers.docusign.com/platform/auth/reference/user-info/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    docusign,
  },
  async run({ $ }) {
    const { accounts = [] } = await this.docusign.getUserInfo({
      $,
    });

    $.export("$summary", `Retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
