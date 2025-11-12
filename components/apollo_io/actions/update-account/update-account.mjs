import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-update-account",
  name: "Update Account",
  description: "Updates an existing account in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#update-an-account)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
      description: "The corporate phone for this account",
    },
  },
  async run({ $ }) {
    const { account } = await this.app.updateAccount({
      $,
      accountId: this.accountId,
      data: utils.cleanObject({
        name: this.name,
        domain: this.domain,
        phone_number: this.phone,
      }),
    });

    $.export("$summary", `Successfully updated account with ID ${account.id}`);

    return account;
  },
};
