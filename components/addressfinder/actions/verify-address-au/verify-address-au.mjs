import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-address-au",
  name: "Verify Australian Address",
  description: "Validates the input Australian address and returns a fully verified address.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addressfinder,
    address: {
      propDefinition: [
        addressfinder,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addressfinder.verifyAustralianAddress({
      address: this.address,
    });

    $.export("$summary", `Successfully verified the address: ${response.full_address}`);
    return response;
  },
};
