import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-create-or-update-account",
  name: "Create or Update Account",
  description:
    "Creates a new account (company) or updates an existing one"
    + " in your Apollo CRM. To create, omit `accountId` and"
    + " provide at least a `name`. To update, provide the"
    + " `accountId` and any fields to change."
    + " Use **Search Accounts** to find existing accounts before"
    + " updating."
    + " Use **List Metadata** (type `account_stages`) to"
    + " discover valid stage IDs."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/create-an-account)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountId: {
      type: "string",
      label: "Account ID",
      description:
        "The ID of an existing account to update. Omit this to"
        + " create a new account.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description:
        "The name of the account/company. Required when"
        + " creating.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The company's domain. Example: `\"acme.com\"`. Apollo"
        + " uses this for enrichment.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The company's phone number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      domain: this.domain,
      phone: this.phone,
    };

    let account;

    if (this.accountId) {
      ({ account } = await this.app.updateAccount({
        $,
        accountId: this.accountId,
        data,
      }));
      $.export(
        "$summary",
        `Updated account ${account.id}: ${account.name}`,
      );
    } else {
      ({ account } = await this.app.createAccount({
        $,
        data,
      }));
      $.export(
        "$summary",
        `Created account ${account.id}: ${account.name}`,
      );
    }

    return account;
  },
};
