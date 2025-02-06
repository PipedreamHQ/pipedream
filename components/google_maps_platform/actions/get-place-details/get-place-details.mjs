import google_maps_platform from "../../google_maps_platform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "google_maps_platform-get-place-details",
  name: "Get Place Details",
  description: "Retrieves detailed information for a specific place using its Place ID. [See the documentation](https://developers.google.com/maps/documentation/places/web-service/place-details)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    google_maps_platform,
    placeId: {
      propDefinition: [
        google_maps_platform,
        "placeId",
      ],
    },
    fields: {
      propDefinition: [
        google_maps_platform,
        "fields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.google_maps_platform.getPlaceDetails({
      placeId: this.placeId,
      fields: this.fields,
    });

    $.export("$summary", `Retrieved details for Place ID ${this.placeId}`);
    return response;
  },
};
