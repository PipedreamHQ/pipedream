import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-create-route",
  name: "Create Route",
  description: "Generates a new route to an existing address. As a prerequisite, the user must create an address using the 'create-address' action if the location is not already available in the address book. The user must provide the necessary props such as destination address.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    samsara,
    destinationAddress: {
      propDefinition: [
        samsara,
        "destinationAddress",
      ],
    },
    routeName: {
      propDefinition: [
        samsara,
        "routeName",
      ],
    },
    jobReference: {
      propDefinition: [
        samsara,
        "jobReference",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.samsara.createRoute({
      destinationAddress: this.destinationAddress,
    });

    $.export("$summary", `Successfully created a new route to ${this.destinationAddress}`);
    return response;
  },
};
