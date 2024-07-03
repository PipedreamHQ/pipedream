import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-buy-insurance",
  name: "Buy Insurance",
  description: "Starts the process of booking an insurance policy for your shipment in Deftship",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deftship,
    vehicleType: {
      propDefinition: [
        deftship,
        "vehicleType",
      ],
    },
    shipmentValue: {
      propDefinition: [
        deftship,
        "shipmentValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deftship.bookInsurancePolicy({
      vehicleType: this.vehicleType,
      shipmentValue: this.shipmentValue,
    });

    $.export("$summary", `Successfully booked insurance policy for vehicle type: ${this.vehicleType}`);
    return response;
  },
};
