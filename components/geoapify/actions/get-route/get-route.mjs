import geoapify from "../../geoapify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "geoapify-get-route",
  name: "Get Route",
  description: "Calculates a route between two sets of latitude and longitude points. [See the documentation](https://apidocs.geoapify.com/docs/routing/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    geoapify,
    fromLatitude: {
      propDefinition: [
        geoapify,
        "fromLatitude",
      ],
    },
    fromLongitude: {
      propDefinition: [
        geoapify,
        "fromLongitude",
      ],
    },
    toLatitude: {
      propDefinition: [
        geoapify,
        "toLatitude",
      ],
    },
    toLongitude: {
      propDefinition: [
        geoapify,
        "toLongitude",
      ],
    },
    mode: {
      propDefinition: [
        geoapify,
        "mode",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        geoapify,
        "type",
      ],
      optional: true,
    },
    units: {
      propDefinition: [
        geoapify,
        "units",
      ],
      optional: true,
    },
    format: {
      propDefinition: [
        geoapify,
        "format",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const route = await this.geoapify.calculateRoute({
      fromLatitude: this.fromLatitude,
      fromLongitude: this.fromLongitude,
      toLatitude: this.toLatitude,
      toLongitude: this.toLongitude,
      mode: this.mode,
      type: this.type,
      units: this.units,
      format: this.format,
    });

    $.export("$summary", "Route calculated successfully");
    return route;
  },
};
