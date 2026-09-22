import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-create-account",
  name: "Create Account",
  description: "Creates a new account in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#create-an-account)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
      description: "The address string for this account, Apollo will intelligently infer the city, state, country, and time zone from your address",
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
    const { account } = await this.app.createAccount({
      $,
      data: {
        name: this.name,
        domain: this.domain,
        raw_address: this.address,
        phone_number: this.phone,
      },
    });

    $.export("$summary", `Successfully created account with ID ${account.id}`);

    return account;
  },
};
