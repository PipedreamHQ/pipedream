import espoCrm from "../../espocrm.app.mjs";

export default {
  key: "espocrm-list-accounts",
  name: "List Accounts",
  description: "Retrieves a list of accounts from Espo CRM. [See the documentation](https://docs.espocrm.com/development/api/account/#list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    espoCrm,
  },
  async run({ $ }) {
    const items = this.espoCrm.paginate({
      resourceFn: this.espoCrm.getAccounts,
      args: {
        $,
      },
    });
    const accounts = [];
    for await (const item of items) {
      accounts.push(item);
    }
    $.export("$summary", `Successfully retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}.`);
    return accounts;
  },
};
