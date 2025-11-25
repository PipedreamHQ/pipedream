import optimoroute from "../../optimoroute.app.mjs";

export default {
  key: "optimoroute-get-routes",
  name: "Get Routes",
  description: "Get routes from Optimoroute. [See the documentation](https://optimoroute.com/api/#get-routes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    optimoroute,
    date: {
      type: "string",
      label: "Date",
      description: "Queried date. YYYY-MM-DD format, for example `2013-12-20`",
    },
    driverExternalId: {
      type: "string",
      label: "Driver External ID",
      description: "Optionally filter by drivers external identifier",
      optional: true,
    },
    driverSerial: {
      type: "string",
      label: "Driver Serial",
      description: "Optionally filter by Serial number of the Driver",
      optional: true,
    },
    vehicleRegistration: {
      type: "string",
      label: "Vehicle Registration",
      description: "Optionally filter by Vehicle registration",
      optional: true,
    },
    includeRoutePolyline: {
      type: "boolean",
      label: "Include Route Polyline",
      description: "Optional property to include route polyline in the output",
      optional: true,
    },
    includeRouteStartEnd: {
      type: "boolean",
      label: "Include Route Start End",
      description: "Optional property to include the route's start and end locations in the output",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.optimoroute.getRoutes({
      $,
      params: {
        date: this.date,
        driverExternalId: this.driverExternalId,
        driverSerial: this.driverSerial,
        vehicleRegistration: this.vehicleRegistration,
        includeRoutePolyline: this.includeRoutePolyline,
        includeRouteStartEnd: this.includeRouteStartEnd,
      },
    });
    $.export("$summary", `Routes found: ${response.routes.length}`);
    return response;
  },
};
