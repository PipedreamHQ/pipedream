import mapbox from "../../mapbox.app.mjs";

export default {
  key: "mapbox-generate-directions",
  name: "Generate Directions",
  description: "Generates directions between two or more locations using Mapbox API. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mapbox,
    startCoordinate: {
      propDefinition: [
        mapbox,
        "startCoordinate",
      ],
    },
    endCoordinate: {
      propDefinition: [
        mapbox,
        "endCoordinate",
      ],
    },
    waypoints: {
      propDefinition: [
        mapbox,
        "waypoints",
      ],
    },
    transportationMode: {
      propDefinition: [
        mapbox,
        "transportationMode",
      ],
    },
    routeType: {
      propDefinition: [
        mapbox,
        "routeType",
      ],
    },
  },
  async run({ $ }) {
    const directions = await this.mapbox.getDirections({
      startCoordinate: this.startCoordinate,
      endCoordinate: this.endCoordinate,
      waypoints: this.waypoints,
      transportationMode: this.transportationMode,
      routeType: this.routeType,
    });
    $.export("$summary", "Generated directions successfully.");
    return directions;
  },
};
