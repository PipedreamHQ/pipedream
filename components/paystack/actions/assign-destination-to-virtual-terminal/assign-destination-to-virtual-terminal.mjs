import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-assign-destination-to-virtual-terminal",
  name: "Assign Destination to Virtual Terminal",
  description: "Add a destination (WhatsApp number) to a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#assign-destination)",
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
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Array of WhatsApp numbers for payment notifications. Each entry should be in the format: `{\"target\":\"+2348012345678\",\"name\":\"John Doe\"}`. Provide as an array of JSON strings.",
    },
  },
  async run({ $ }) {
    // Parse destinations array
    const destinations = this.destinations.map((dest) => {
      if (typeof dest === "string") {
        return JSON.parse(dest);
      }
      return dest;
    });

    const response = await this.paystack.assignDestinationToVirtualTerminal({
      $,
      code: this.code,
      data: {
        destinations,
      },
    });

    $.export("$summary", `Assigned ${destinations.length} destination${destinations.length === 1
      ? ""
      : "s"} to virtual terminal "${this.code}"`);
    return response;
  },
};
