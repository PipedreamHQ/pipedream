import geoapify from "../../geoapify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "geoapify-search-address",
  name: "Search Address",
  description: "Retrieves geocoding information for a given address. [See the documentation](https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    geoapify,
    address: {
      propDefinition: [
        "geoapify",
        "address",
      ],
    },
    type: {
      propDefinition: [
        "geoapify",
        "type",
      ],
    },
    format: {
      propDefinition: [
        "geoapify",
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.geoapify.geocodeAddress({
      address: this.address,
      type: this.type,
      format: this.format,
    });
    $.export("$summary", `Successfully retrieved geocoding information for address ${this.address}`);
    return response;
  },
};
