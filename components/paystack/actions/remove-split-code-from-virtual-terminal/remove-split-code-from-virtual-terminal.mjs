import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-remove-split-code-from-virtual-terminal",
  name: "Remove Split Code from Virtual Terminal",
  description: "Remove Split Code from Virtual Terminal. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#remove-split)",
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
    splitCode: {
      propDefinition: [
        paystack,
        "splitCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.removeSplitCodeFromVirtualTerminal({
      $,
      code: this.code,
      data: {
        split_code: this.splitCode,
      },
    });

    $.export("$summary", `Removed split code ${this.splitCode} from virtual terminal ${this.code}`);
    return response;
  },
};
