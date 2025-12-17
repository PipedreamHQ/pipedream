import app from "../../google_maps_platform.app.mjs";
import { simplifyPlace } from "../../common/utils.mjs";

export default {
  key: "google_maps_platform-get-place-details",
  name: "Get Place Details",
  description: "Retrieves detailed information for a specific place using its Place ID. [See the documentation](https://developers.google.com/maps/documentation/places/web-service/place-details)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    placeId: {
      type: "string",
      label: "Place ID",
      description: "A textual identifier that uniquely identifies a place, returned from Search Places Action.",
    },
    simplified: {
      propDefinition: [
        app,
        "simplified",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.app.getPlaceDetails({
      $,
      placeId: this.placeId,
    });

    if (this.simplified) {
      response = simplifyPlace(response);
    }

    $.export("$summary", `Retrieved details for Place ID ${this.placeId}`);
    return response;
  },
};
