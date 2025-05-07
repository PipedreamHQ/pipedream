import app from "../../plaid.app.mjs";
import institutions from "../../common/sandbox-institutions.mjs";

export default {
  key: "plaid-create-sandbox-public-token",
  name: "Create Sandbox Public Token",
  description: "Creates a valid `public_token` for an arbitrary institution ID, initial products, and test credentials. [See the documentation](https://plaid.com/docs/api/sandbox/#sandboxpublic_tokencreate).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    institutionId: {
      type: "string",
      label: "Institution ID",
      description: "The ID of the institution the Item will be associated with",
      options: Object.values(institutions),
    },
    initialProducts: {
      type: "string[]",
      label: "Initial Products",
      description: "The products to initially pull for the Item. May be any products that the specified institution supports.",
      options: [
        "assets",
        "auth",
        "balance",
        "employment",
        "identity",
        "income_verification",
        "identity_verification",
        "investments",
        "liabilities",
        "payment_initiation",
        "standing_orders",
        "statements",
        "transactions",
        "transfer",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to which Plaid should send webhook notifications. You must configure at least one webhook to enable webhooks.",
      optional: true,
    },
    overrideUsername: {
      type: "string",
      label: "Override Username",
      description: "Test username to use for the creation of the Sandbox Item. Default is 'user_good'.",
      optional: true,
    },
    overridePassword: {
      type: "string",
      label: "Override Password",
      description: "Test password to use for the creation of the Sandbox Item. Default is 'pass_good'.",
      optional: true,
    },
    userToken: {
      type: "string",
      label: "User Token",
      description: "The user token associated with the User data is being requested for.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      institutionId,
      initialProducts,
      webhookUrl,
      overrideUsername,
      overridePassword,
      userToken,
    } = this;

    const options = {};

    if (webhookUrl) {
      options.webhook = webhookUrl;
    }

    if (overrideUsername || overridePassword) {
      options.override_username = overrideUsername;
      options.override_password = overridePassword;
    }

    const response = await app.createSandboxPublicToken({
      institution_id: institutionId,
      initial_products: initialProducts,
      ...(Object.keys(options).length > 0 && {
        options,
      }),
      ...(userToken && {
        user_token: userToken,
      }),
    });

    $.export("$summary", `Successfully created sandbox public token for institution ${institutionId}`);

    return response;
  },
};
