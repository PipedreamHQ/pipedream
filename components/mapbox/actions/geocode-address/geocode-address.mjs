import mapbox from "../../mapbox.app.mjs";

export default {
  key: "mapbox-geocode-address",
  name: "Geocode Address",
  description: "Retrieves the geocoded location for a given address. [See the documentation](https://docs.mapbox.com/api/search/geocoding/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mapbox,
    address: {
      type: "string",
      label: "Address",
      description: "The address (or partial address) to geocode. This could be an address, a city name, etc. Must consist of at most 20 words and numbers separated by spacing and punctuation, and at most 256 characters.",
    },
    boundingBox: {
      type: "string",
      label: "Bounding Box",
      description: "Limit results to only those contained within the supplied bounding box. Bounding boxes should be supplied as four numbers separated by commas, in `minLon,minLat,maxLon,maxLat` order. The bounding box cannot cross the 180th meridian. You can use the [Location Helper](https://labs.mapbox.com/location-helper) to find a bounding box for use with this API.",
      optional: true,
    },
    proximity: {
      type: "string",
      label: "Proximity",
      description: "Bias the response to favor results that are closer to this location. Provided as two comma-separated coordinates in `longitude,latitude` order.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mapbox.geocode({
      $,
      params: {
        q: this.address,
        bBox: this.boundingBox,
        proximity: this.proximity,
      },
    });
    $.export("$summary", `Geocoded location for "${this.address}" retrieved successfully`);
    return response;
  },
};
