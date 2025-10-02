import wise from "../../wise.app.mjs";

export default {
  key: "wise-get-recipient-account",
  name: "Get Recipient Account",
  description: "Get a specific recipient account. [See docs here](https://api-docs.wise.com/api-reference/balance#get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wise,
    accountId: {
      propDefinition: [
        wise,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wise.getAccount({
      $,
      accountId: this.accountId,
    });

    $.export("$summary", `Successfully retrieved account with ID: ${this.accountId}!`);
    return response;
  },
};
