import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-update-virtual-terminal",
  name: "Update Virtual Terminal",
  description: "Update a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#update)",
  version: "0.0.1",
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
    name: {
      type: "string",
      label: "Name",
      description: "The new name for the virtual terminal",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.updateVirtualTerminal({
      $,
      code: this.code,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Updated virtual terminal to "${this.name}"`);
    return response;
  },
};
