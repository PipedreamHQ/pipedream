import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-get-rent-estimate",
  name: "Get Rent Estimate",
  description: "Fetches a rent estimate and comparable properties for a given property. 'property_id' is a required prop. An optional prop could be 'date', to fetch an estimate from a specific date.",
  version: "0.0.1",
  type: "action",
  props: {
    rentcast,
    propertyId: rentcast.propDefinitions.propertyId,
    date: {
      ...rentcast.propDefinitions.date,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rentcast.fetchRentEstimate({
      propertyId: this.propertyId,
      date: this.date,
    });
    $.export("$summary", `Successfully fetched rent estimate for property ID ${this.propertyId}`);
    return response;
  },
};
