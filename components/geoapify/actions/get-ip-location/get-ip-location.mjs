import geoapify from "../../geoapify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "geoapify-get-ip-location",
  name: "Get IP Location",
  description: "Retrieves geographical coordinates for a given IP address. [See the documentation](https://apidocs.geoapify.com/docs/ip-geolocation/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    geoapify,
    ipAddress: {
      propDefinition: [
        geoapify,
        "ipAddress",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.geoapify.geolocateIP({
      ipAddress: this.ipAddress,
    });
    $.export("$summary", `Retrieved location for IP: ${this.ipAddress}`);
    return response;
  },
};
