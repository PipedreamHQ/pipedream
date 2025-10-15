import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-get-account-metadata",
  name: "Get Account Metadata",
  description: "Get the metadata of a Nordigen account. [See the docs](https://ob.nordigen.com/api/docs#/accounts/retrieve%20account%20metadata)",
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
    const accountMetadata = await this.nordigen.getAccountMetadata(this.accountId, {
      $,
    });

    $.export("$summary", `Successfully retrieved account metadata for account with ID ${this.accountId}`);

    return accountMetadata;
  },
};
