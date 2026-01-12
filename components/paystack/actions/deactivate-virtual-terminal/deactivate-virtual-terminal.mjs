import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-deactivate-virtual-terminal",
  name: "Deactivate Virtual Terminal",
  description: "Deactivate a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#deactivate)",
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
    const response = await this.paystack.deactivateVirtualTerminal({
      $,
      code: this.code,
    });

    $.export("$summary", `Deactivated virtual terminal ${this.code}`);
    return response;
  },
};
