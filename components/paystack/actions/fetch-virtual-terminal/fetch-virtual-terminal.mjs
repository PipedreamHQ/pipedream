import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-fetch-virtual-terminal",
  name: "Fetch Virtual Terminal",
  description: "Fetch a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#fetch)",
  version: "0.0.1",
  type: "action",
  props: {
    paystack,
    code: {
      propDefinition: [
        paystack,
        "virtualTerminalCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.fetchVirtualTerminal({
      $,
      code: this.code,
    });

    $.export("$summary", `Fetched virtual terminal "${response.data.name}"`);
    return response;
  },
};
