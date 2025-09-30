import addresszen from "../../addresszen.app.mjs";

export default {
  key: "addresszen-freeform-verify-correct-us-address",
  name: "Verify and Correct Freeform US Address",
  description: "Verify (CASS) and correct a US address using a complete address. [See the documentation](https://docs.addresszen.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addresszen,
    addressLine: {
      propDefinition: [
        addresszen,
        "addressLine",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addresszen.verifyAddress({
      $,
      data: {
        query: this.addressLine,
      },
    });
    $.export("$summary", "Successfully verified and corrected the address");
    return response;
  },
};
