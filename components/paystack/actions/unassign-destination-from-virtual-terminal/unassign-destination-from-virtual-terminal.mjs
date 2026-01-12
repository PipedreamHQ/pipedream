import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-unassign-destination-from-virtual-terminal",
  name: "Unassign Destination from Virtual Terminal",
  description: "Unassign a destination (WhatsApp Number) from a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#unassign-destination)",
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
    targets: {
      type: "string[]",
      label: "Targets",
      description: "Array of WhatsApp numbers to unassign (e.g., `+2348012345678`)",
    },
  },
  async run({ $ }) {
    const response = await this.paystack.unassignDestinationFromVirtualTerminal({
      $,
      code: this.code,
      data: {
        targets: this.targets,
      },
    });

    $.export("$summary", `Unassigned ${this.targets.length} destination${this.targets.length === 1
      ? ""
      : "s"} from virtual terminal "${this.code}"`);
    return response;
  },
};
