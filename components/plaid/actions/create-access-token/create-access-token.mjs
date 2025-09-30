import app from "../../plaid.app.mjs";

export default {
  key: "plaid-create-access-token",
  name: "Create Access Token",
  description: "Exchange a Link `public_token` for an API `access_token`. [See the documentation](https://plaid.com/docs/api/items/#itempublic_tokenexchange).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    publicToken: {
      propDefinition: [
        app,
        "publicToken",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      publicToken,
    } = this;

    const response = await app.exchangePublicToken({
      public_token: publicToken,
    });

    $.export("$summary", "Successfully created access token for public token");

    return response;
  },
};
