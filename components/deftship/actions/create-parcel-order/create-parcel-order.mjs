import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-create-parcel-order",
  name: "Create Parcel Order",
  description: "Initializes a new parcel order within Deftship. This will require parcel size and destination.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deftship,
    parcelSize: {
      propDefinition: [
        deftship,
        "parcelSize",
      ],
    },
    destination: {
      propDefinition: [
        deftship,
        "destination",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deftship.createParcelOrder({
      parcelSize: this.parcelSize,
      destination: this.destination,
    });
    $.export("$summary", `Successfully created parcel order with ID: ${response.id}`);
    return response;
  },
};
