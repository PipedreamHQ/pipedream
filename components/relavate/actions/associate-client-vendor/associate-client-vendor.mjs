import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-associate-client-vendor",
  name: "Associate Client with Vendor",
  description: "Associates a client with a vendor in Relavate. [See the documentation](https://api.relavate.co/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    relavate,
    clientId: {
      propDefinition: [
        relavate,
        "clientId",
      ],
    },
    vendorId: {
      propDefinition: [
        relavate,
        "vendorId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.relavate.associateClientVendor(this.clientId, this.vendorId);
    $.export("$summary", `Successfully associated client with ID ${this.clientId} to vendor with ID ${this.vendorId}`);
    return response;
  },
};
