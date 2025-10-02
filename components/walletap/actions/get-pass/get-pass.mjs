import walletap from "../../walletap.app.mjs";

export default {
  key: "walletap-get-pass",
  name: "Get Pass",
  description: "Gets a Walletap pass by ID. [See the documentation](https://walletap.io/docs/api#tag/Pass/operation/getPass)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    walletap,
    passId: {
      type: "string",
      label: "Pass ID",
      description: "Internal pass ID or External pass ID",
    },
  },
  async run({ $ }) {
    const response = await this.walletap.getPass({
      $,
      params: {
        id: this.passId,
      },
    });

    $.export("$summary", `Successfully updated pass with id: ${response.id}`);
    return response;
  },
};
