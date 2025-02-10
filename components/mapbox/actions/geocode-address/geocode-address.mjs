import mapbox from "../../mapbox.app.mjs";

export default {
  key: "mapbox-geocode-address",
  name: "Geocode Address",
  description: "Retrieves the geocoded location for a given address. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mapbox,
    address: {
      propDefinition: [
        mapbox,
        "address",
      ],
    },
    boundingBox: {
      propDefinition: [
        mapbox,
        "boundingBox",
      ],
      optional: true,
    },
    proximity: {
      propDefinition: [
        mapbox,
        "proximity",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mapbox.geocode({
      address: this.address,
      boundingBox: this.boundingBox,
      proximity: this.proximity,
    });
    $.export("$summary", `Geocoded location for address "${this.address}" retrieved successfully`);
    return response;
  },
};
