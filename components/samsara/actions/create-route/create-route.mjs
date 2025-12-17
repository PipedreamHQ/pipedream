import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import samsara from "../../samsara.app.mjs";

export default {
  key: "samsara-create-route",
  name: "Create Route",
  description: "Generates a new route to an existing address. As a prerequisite, the user must create an address using the 'create-address' action if the location is not already available in the address book. The user must provide the necessary props such as destination address.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    samsara,
    driverId: {
      propDefinition: [
        samsara,
        "driverId",
      ],
      optional: true,
    },
    externalIds: {
      propDefinition: [
        samsara,
        "externalIds",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name for the route",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the route.",
      optional: true,
    },
    routeCompletionCondition: {
      type: "string",
      label: "Route Completion Condition",
      description: "Defaults to 'arriveLastStop' which ends the route upon arriving at the final stop. The condition 'departLastStop' ends the route upon departing the last stop. If 'arriveLastStop' is set, then the departure time of the final stop should not be set.",
      options: [
        "arriveLastStop",
        "departLastStop",
      ],
      optional: true,
    },
    routeStartingCondition: {
      type: "string",
      label: "Route Starting Condition",
      description: "Defaults to 'departFirstStop' which starts the route upon departing the first stop in the route. The condition 'arriveFirstStop' starts the route upon arriving at the first stop in the route. If 'departFirstStop' is set, the arrival time of the first stop should not be set.",
      options: [
        "departFirstStop",
        "arriveFirstStop",
      ],
      optional: true,
    },
    stops: {
      type: "object",
      label: "Stops",
      description: "List of objects of stops along the route. For each stop, exactly one of addressId and singleUseLocation are required. Depending on the settings on your route, either a scheduledArrivalTime or scheduledDepartureTime must be specified for the first job. [See further information](https://developers.samsara.com/reference/createroute)",
    },
    vehicleId: {
      propDefinition: [
        samsara,
        "vehicleId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.samsara.createRoute({
        $,
        data: {
          driverId: this.driverId,
          externalIds: parseObject(this.externalIds),
          name: this.name,
          notes: this.notes,
          settings: {
            routeCompletionCondition: this.routeCompletionCondition,
            routeStartingCondition: this.routeStartingCondition,
          },
          stops: parseObject(this.stops),
          vehicleId: this.vehicleId,
        },
      });

      $.export("$summary", `Successfully created a new route with Id: ${response.data?.id}`);
      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).message);
    }
  },
};
