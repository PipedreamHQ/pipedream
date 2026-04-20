import app from "../../apollo_io_oauth.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io_oauth-search-accounts",
  name: "Search Accounts",
  description:
    "Searches for accounts (companies) in your Apollo CRM by"
    + " name, stage, or sort criteria. Returns account name,"
    + " domain, industry, and stage."
    + " Use this to find accounts before updating them with"
    + " **Create or Update Account** or linking them to"
    + " contacts or opportunities."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/search-for-accounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description:
        "Search by account/organization name."
        + " Example: `\"Acme Corp\"`.",
      optional: true,
    },
    accountStageIds: {
      type: "string[]",
      label: "Account Stage IDs",
      description:
        "Filter by one or more account stage IDs."
        + " Use **List Metadata** (type `account_stages`) to"
        + " discover valid stage IDs.",
      optional: true,
    },
    sortByField: {
      type: "string",
      label: "Sort By Field",
      description: "The field to sort results by.",
      options: [
        "account_last_activity_date",
        "account_created_at",
      ],
      optional: true,
    },
    sortAscending: {
      type: "boolean",
      label: "Sort Ascending",
      description:
        "Set to `true` for ascending order, `false` for"
        + " descending. Defaults to descending.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description:
        "Maximum number of accounts to return. Defaults to 100."
        + " Max 600.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchAccounts,
      resourceFnArgs: {
        params: {
          q_organization_name: this.query,
          account_stage_ids: this.accountStageIds,
          sort_by_field: this.sortByField,
          sort_ascending: this.sortAscending,
        },
      },
      resourceName: "accounts",
      max: this.maxResults ?? undefined,
    });

    const accounts = await utils.iterate(resourcesStream);

    $.export(
      "$summary",
      `Found ${accounts.length} account${accounts.length === 1
        ? ""
        : "s"}`,
    );

    return accounts;
  },
};
