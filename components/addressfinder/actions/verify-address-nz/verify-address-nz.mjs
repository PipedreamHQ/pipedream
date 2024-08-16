import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-address-nz",
  name: "Verify New Zealand Address",
  description: "Validates the input New Zealand address and returns a fully verified address.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addressfinder,
    nzAddress: {
      type: "string",
      label: "New Zealand Address",
      description: "The New Zealand address to be verified",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.addressfinder.verifyNewZealandAddress({
      nzAddress: this.nzAddress,
    });
    $.export("$summary", "Successfully verified the New Zealand address");
    return response;
  },
};
