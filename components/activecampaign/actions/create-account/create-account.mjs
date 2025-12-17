import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-create-account",
  name: "Create Account",
  description: "Create a new account. See the docs [here](https://developers.activecampaign.com/reference#create-an-account-new).",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    activecampaign,
    name: {
      propDefinition: [
        activecampaign,
        "accountName",
      ],
    },
    accountUrl: {
      propDefinition: [
        activecampaign,
        "accountUrl",
      ],
    },
  },
  async run({ $ }) {
    const response =
      await this.activecampaign.createAccount({
        $,
        data: {
          account: {
            name: this.name,
            accountUrl: this.accountUrl,
          },
        },
      });

    if (!response.account) {
      throw new Error(JSON.stringify(response));
    }

    $.export("$summary", `Successfully created account "${response.account.name}"`);

    return response;
  },
};
