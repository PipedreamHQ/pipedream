import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-create-virtual-terminal",
  name: "Create Virtual Terminal",
  description: "Create a Virtual Terminal on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paystack,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the virtual terminal",
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Array of WhatsApp numbers for payment notifications. Each entry should be in the format: `{\"target\":\"+2348012345678\",\"name\":\"John Doe\"}`. Provide as an array of JSON strings.",
    },
    splitCode: {
      propDefinition: [
        paystack,
        "splitCode",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        paystack,
        "metadata",
      ],
      optional: true,
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

    const response = await this.paystack.createVirtualTerminal({
      $,
      data: {
        name: this.name,
        destinations,
        ...this.splitCode && {
          split_code: this.splitCode,
        },
        ...this.metadata && {
          metadata: this.metadata,
        },
      },
    });

    $.export("$summary", `Virtual Terminal "${this.name}" created successfully`);
    return response;
  },
};
