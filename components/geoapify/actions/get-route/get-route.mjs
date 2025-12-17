import geoapify from "../../geoapify.app.mjs";

export default {
  key: "geoapify-get-route",
  name: "Get Route",
  description: "Calculates a route between two sets of latitude and longitude points. [See the documentation](https://apidocs.geoapify.com/docs/routing/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    geoapify,
    fromLatitude: {
      type: "string",
      label: "From Latitude",
      description: "The latitude of the starting point",
    },
    fromLongitude: {
      type: "string",
      label: "From Longitude",
      description: "The longitude of the starting point",
    },
    toLatitude: {
      type: "string",
      label: "To Latitude",
      description: "The latitude of the destination point",
    },
    toLongitude: {
      type: "string",
      label: "To Longitude",
      description: "The longitude of the destination point",
    },
    mode: {
      propDefinition: [
        geoapify,
        "mode",
      ],
    },
    type: {
      propDefinition: [
        geoapify,
        "routeOptimizationType",
      ],
    },
    units: {
      propDefinition: [
        geoapify,
        "units",
      ],
    },
    format: {
      propDefinition: [
        geoapify,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const route = await this.geoapify.calculateRoute({
      $,
      params: {
        waypoints: `${this.fromLatitude},${this.fromLongitude}|${this.toLatitude},${this.toLongitude}`,
        mode: this.mode,
        type: this.type,
        units: this.units,
        format: this.format,
      },
    });
    $.export("$summary", "Route calculated successfully");
    return route;
  },
};
