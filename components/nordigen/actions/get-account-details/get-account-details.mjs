import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-get-account-details",
  name: "Get Account Details",
  description: "Get the details of a Nordigen account. [See the docs](https://ob.nordigen.com/api/docs#/accounts/accounts_details_retrieve)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nordigen,
    requisitionId: {
      propDefinition: [
        nordigen,
        "requisitionId",
      ],
    },
    accountId: {
      propDefinition: [
        nordigen,
        "accountId",
        (c) => ({
          requisitionId: c.requisitionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const accountDetails = await this.nordigen.getAccountDetails(this.accountId, {
      $,
    });

    $.export("$summary", `Successfully retrieved account details for account with ID ${this.accountId}`);

    return accountDetails;
  },
};
