import bigDataCloud from "../../big_data_cloud.app.mjs";

export default {
  key: "big_data_cloud-perform-ip-geolocation",
  name: "Perform IP Geolocation",
  description: "Obtain a user's location data based on their IP address. [See the documentation](https://www.bigdatacloud.com/docs/api/ip-address-geolocation-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigDataCloud,
    ip: {
      type: "string",
      label: "IP Address",
      description: "IPv4 IP address in a string or numeric format or IPv6 IP address in a string format. If omitted, the caller’s IP address is assumed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bigDataCloud.performIpGeolocation({
      params: this.ip
        ? {
          ip: this.ip,
        }
        : {},
      $,
    });
    if (response) {
      $.export("$summary", "Geolocation successfully performed.");
    }
    return response;
  },
};
