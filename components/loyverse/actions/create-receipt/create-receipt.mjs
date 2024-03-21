import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-create-receipt",
  name: "Create Receipt",
  description: "Creates a new receipt for a specific store. [See the documentation](https://developer.loyverse.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    loyverse,
    storeId: loyverse.propDefinitions.storeId,
    itemIds: {
      ...loyverse.propDefinitions.itemIds,
      optional: true,
    },
    paymentDetails: {
      ...loyverse.propDefinitions.paymentDetails,
      optional: true,
    },
    customerId: {
      ...loyverse.propDefinitions.customerId,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.loyverse.createReceipt({
      storeId: this.storeId,
      itemIds: this.itemIds,
      paymentDetails: this.paymentDetails,
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully created receipt with number ${response.receipt_number}`);
    return response;
  },
};
