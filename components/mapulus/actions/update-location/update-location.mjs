import mapulus from "../../mapulus.app.mjs";

export default {
  key: "mapulus-update-location",
  name: "Update Location",
  description: "Updates an existing location in Mapulus. [See the documentation](https://developer.mapulus.com/index.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mapulus,
    locationId: {
      propDefinition: [
        mapulus,
        "locationId",
      ],
    },
    layerId: {
      propDefinition: [
        mapulus,
        "layerId",
        (c) => ({
          locationId: c.locationId,
        }),
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        mapulus,
        "title",
      ],
      optional: true,
    },
    latitude: {
      propDefinition: [
        mapulus,
        "latitude",
      ],
      optional: true,
    },
    longitude: {
      propDefinition: [
        mapulus,
        "longitude",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        mapulus,
        "address",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const location = await this.mapulus.getLocation({
      locationId: this.locationId,
      $,
    });

    const response = await this.mapulus.updateLocation({
      locationId: this.locationId,
      data: {
        object: "location",
        lat: this.latitude || location.lat,
        lon: this.longitude || location.lon,
        title: this.title || location.title,
        layer_id: this.layerId || location.layer_id,
        address: this.address || location.address,
      },
      $,
    });

    if (response?.id) {
      $.export("summary", `Successfully updated location with ID ${response.id}`);
    }

    return response;
  },
};
