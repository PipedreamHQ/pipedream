import geoapify from "../../geoapify.app.mjs";

export default {
  key: "geoapify-get-ip-location",
  name: "Get IP Location",
  description: "Retrieves geographical coordinates for a given IP address. [See the documentation](https://apidocs.geoapify.com/docs/ip-geolocation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    geoapify,
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The IP address to lookup",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.geoapify.geolocateIP({
      $,
      params: {
        ipAddress: this.ipAddress,
      },
    });
    $.export("$summary", `Retrieved location for IP: ${response.ip}`);
    return response;
  },
};
