import mapulus from "../../mapulus.app.mjs";

export default {
  key: "mapulus-create-location",
  name: "Create Location",
  description: "Create a new location in Mapulus. [See the documentation](https://developer.mapulus.com/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    mapulus,
    mapId: {
      propDefinition: [
        mapulus,
        "mapId",
      ],
    },
    layerId: {
      propDefinition: [
        mapulus,
        "layerId",
        (c) => ({
          mapId: c.mapId,
        }),
      ],
    },
    title: {
      propDefinition: [
        mapulus,
        "title",
      ],
    },
    latitude: {
      propDefinition: [
        mapulus,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        mapulus,
        "longitude",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mapulus.createLocation({
      data: {
        object: "location",
        lat: this.latitude,
        lon: this.longitude,
        title: this.title,
        map_id: this.mapId,
        layer_id: this.layerId,
      },
      $,
    });

    if (response?.id) {
      $.export("summary", `Successfully created location with ID ${response.id}`);
    }

    return response;
  },
};
