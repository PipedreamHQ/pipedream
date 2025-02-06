import google_maps_platform from "../../google_maps_platform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "google_maps_platform-search-places",
  name: "Search Places",
  description: "Searches for places based on location, radius, and optional filters like keywords, place type, or name. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    google_maps_platform,
    locationLatitude: {
      propDefinition: [
        google_maps_platform,
        "locationLatitude",
      ],
    },
    locationLongitude: {
      propDefinition: [
        google_maps_platform,
        "locationLongitude",
      ],
    },
    radius: {
      propDefinition: [
        google_maps_platform,
        "radius",
      ],
    },
    keywords: {
      propDefinition: [
        google_maps_platform,
        "keywords",
      ],
      optional: true,
    },
    placeType: {
      propDefinition: [
        google_maps_platform,
        "placeType",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        google_maps_platform,
        "name",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      location: `${this.locationLatitude},${this.locationLongitude}`,
    };

    if (this.radius) {
      params.radius = this.radius;
    }

    if (this.keywords) {
      params.keyword = this.keywords;
    }

    if (this.placeType) {
      params.type = this.placeType;
    }

    if (this.name) {
      params.name = this.name;
    }

    const response = await this.google_maps_platform.searchPlaces({
      params,
    });

    const placeCount = response.results.length;
    $.export("$summary", `Found ${placeCount} place(s) near (${this.locationLatitude}, ${this.locationLongitude})`);

    return response;
  },
};
