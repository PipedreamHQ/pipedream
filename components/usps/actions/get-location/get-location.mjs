import usps from "../../usps.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "usps-get-location",
  name: "Get USPS Location",
  description: "Returns one or more acceptable entry locations based on the provided ZIP Code. [See the documentation](https://developer.usps.com/api/79#tag/resources/operation/get-dropoff-location)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    usps,
    zipCode: {
      propDefinition: [
        usps,
        "zipCode",
      ],
    },
  },
  async run({ $ }) {
    const locations = await this.usps.getDropOffLocation({
      zipCode: this.zipCode,
    });
    $.export("$summary", `Successfully retrieved drop-off locations for ZIP Code ${this.zipCode}`);
    return locations;
  },
};
