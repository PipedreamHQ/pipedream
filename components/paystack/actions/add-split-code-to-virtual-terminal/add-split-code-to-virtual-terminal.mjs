import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-add-split-code-to-virtual-terminal",
  name: "Add Split Code to Virtual Terminal",
  description: "Add Split Code to Virtual Terminal. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#add-split)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.paystack.addSplitCodeToVirtualTerminal({
      $,
      code: this.code,
      data: {
        split_code: this.splitCode,
      },
    });

    $.export("$summary", `Added split code ${this.splitCode} to virtual terminal ${this.code}`);
    return response;
  },
};
