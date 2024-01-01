import espoCrm from "../../espo-crm.app.mjs";

export default {
  key: "espo-crm-list-accounts",
  name: "List Accounts",
  description: "Retrieves a list of accounts from Espo CRM. Optionally, you can specify filters like name or industry to narrow down the results.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    espoCrm,
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Specify the account name to filter the results",
      optional: true,
    },
    accountIndustry: {
      type: "string",
      label: "Account Industry",
      description: "Specify the account industry to filter the results",
      optional: true,
    },
  },
  async run({ $ }) {
    const opts = {
      params: {
        select: "name,industry",
      },
    };

    if (this.accountName) {
      opts.params.where = [
        {
          type: "equals",
          attribute: "name",
          value: this.accountName,
        },
      ];
    }

    if (this.accountIndustry) {
      if (!opts.params.where) {
        opts.params.where = [];
      }
      opts.params.where.push({
        type: "equals",
        attribute: "industry",
        value: this.accountIndustry,
      });
    }

    const response = await this.espoCrm.getAccounts(opts);
    $.export("$summary", `Fetched ${response.length} accounts`);
    return response;
  },
};
