import amilia from "../../amilia.app.mjs";

export default {
  key: "amilia-list-accounts",
  name: "List Accounts",
  description: "List all accounts in an organization. [See the docs here](https://www.amilia.com/ApiDocs/v3org#GetAccounts)",
  version: "0.0.1",
  type: "action",
  props: {
    amilia,
    showArchived: {
      type: "boolean",
      label: "Show Archived?",
      description: "Option to also show archived items.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.amilia.listAccounts({
      $,
      params: {
        showArchived: this.showArchived,
      },
    });
    $.export("$summary", "Succesfully retrieved all accounts");
    return response;
  },
};
