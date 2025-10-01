import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-address-nz",
  name: "Verify New Zealand Address",
  description: "Validates a New Zealand address. [See the documentation](https://addressfinder.com.au/api/nz/address/verification/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addressfinder,
    address: {
      type: "string",
      label: "New Zealand Address",
      description: "The New Zealand address to be verified, e.g. `186 Willis St, Te Aro`",
    },
    domain: {
      propDefinition: [
        addressfinder,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const { address } = this;
    const response = await this.addressfinder.verifyNewZealandAddress({
      $,
      params: {
        q: address,
        domain: this.domain,
      },
    });
    $.export("$summary", `Successfully verified NZ address "${address}"`);
    return response;
  },
};
