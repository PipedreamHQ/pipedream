import oto from "../../oto.app.mjs";

export default {
  key: "oto-track-shipment",
  name: "Track Shipment",
  description: "track a shipment by providing the tracking number and delivery company name. [See the documentation](https://apis.tryoto.com/#3b8d84ec-7769-41d4-adf2-6d2d8c1189a4)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    oto,
    trackingNumber: {
      type: "string",
      label: "Tracking Number",
      description: "The shipment/ tracking number that you wanna track",
    },
    deliveryCompanyName: {
      type: "string",
      label: "Delivery Company Name",
      description: "The name of the delivery company",
    },
    brandName: {
      propDefinition: [
        oto,
        "brandName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.oto.trackShipment({
      $,
      data: {
        trackingNumber: this.trackingNumber,
        deliveryCompanyName: this.deliveryCompanyName,
        brandName: this.brandName,
        statusHistory: true,
      },
    });
    $.export("$summary", `Successfully tracked shipment with tracking number: ${this.trackingNumber}`);
    return response;
  },
};
