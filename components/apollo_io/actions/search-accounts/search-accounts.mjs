import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-search-accounts",
  name: "Search For Accounts",
  description: "Search for accounts in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-accounts)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "The account's name",
    },
    accountStageId: {
      propDefinition: [
        app,
        "accountStageId",
      ],
      type: "string[]",
      optional: true,
    },
    sortByField: {
      type: "string",
      label: "Sort By Field",
      description: "The field to sort the response.",
      options: [
        "account_last_activity_date",
        "account_created_at",
      ],
      optional: true,
    },
    sortAscending: {
      type: "boolean",
      label: "Sort Ascending",
      description: "The order to be applied to the sort.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchAccounts,
      resourceFnArgs: {
        params: {
          q_organization_name: this.search,
          account_stage_ids: this.accountStageId,
          sort_by_field: this.sortByField,
          sort_ascending: this.sortAscending,
        },
      },
      resourceName: "accounts",
    });

    const accounts = await utils.iterate(resourcesStream);

    $.export("$summary", `Successfully fetched ${accounts.length} accounts.`);

    return accounts;

  },
};
