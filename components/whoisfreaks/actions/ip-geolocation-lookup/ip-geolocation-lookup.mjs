import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-ip-geolocation-lookup",
  name: "IP Geolocation Lookup",
  description:
    "Retrieve geolocation details (country, city, region, ASN, ISP, coordinates) for a single IP address. Supports both IPv4 and IPv6 addresses. Use this action to enrich events with location data, perform fraud detection, or geo-target users. [See the documentation](https://whoisfreaks.com/documentation/ip-geolocation-api#geo-lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    whoisfreaks,
    ip: {
      propDefinition: [
        whoisfreaks,
        "ip",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.lookupIpGeolocation({
      $,
      params: {
        ip: this.ip,
      },
    });
    $.export("$summary", `Successfully fetched geolocation data for IP ${this.ip}`);
    return response;
  },
};
