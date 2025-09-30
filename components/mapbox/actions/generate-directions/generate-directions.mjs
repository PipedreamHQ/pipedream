import mapbox from "../../mapbox.app.mjs";

export default {
  key: "mapbox-generate-directions",
  name: "Generate Directions",
  description: "Generates directions between two or more locations using Mapbox API. [See the documentation](https://docs.mapbox.com/api/navigation/directions/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mapbox,
    startCoordinate: {
      type: "string",
      label: "Start Coordinate",
      description: "The starting point in the format `longitude,latitude`, E.g. `-85.244869,37.835819`",
    },
    endCoordinate: {
      type: "string",
      label: "End Coordinate",
      description: "The ending point in the format `longitude,latitude`, E.g. `-85.244869,37.835819`",
    },
    transportationMode: {
      propDefinition: [
        mapbox,
        "transportationMode",
      ],
    },
    steps: {
      type: "boolean",
      label: "Steps",
      description: "Whether to return steps and turn-by-turn instructions (`true`) or not (`false`, default)",
      optional: true,
    },
    alternatives: {
      type: "boolean",
      label: "Alternatives",
      description: "Whether to try to return alternative routes (`true`) or not (`false`, default). An alternative route is a route that is significantly different from the fastest route, but still close in time.",
      optional: true,
    },
    exclude: {
      propDefinition: [
        mapbox,
        "exclude",
      ],
    },
  },
  async run({ $ }) {
    const directions = await this.mapbox.getDirections({
      $,
      transportationMode: this.transportationMode,
      coordinates: `${this.startCoordinate};${this.endCoordinate}`,
      params: {
        steps: this.steps,
        alternatives: this.alternatives,
        exclude: this.exclude && this.exclude.join(","),
      },
    });
    $.export("$summary", "Generated directions successfully.");
    return directions;
  },
};
