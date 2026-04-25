import ip2geo from "../../ip2geo.app.mjs";

export default {
  name: "Lookup IP",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "ip2geo-lookup-ip",
  description: "Convert an IP address into geolocation data including city, country, timezone, ASN, and currency. [See docs](https://ip2geo.dev/docs)",
  type: "action",
  props: {
    ip2geo,
    ip: {
      label: "IP Address",
      description: "The IP address to look up. E.g. `8.8.8.8` or `2001:4860:4860::8888`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.ip2geo.lookupIP({
      $,
      ip: this.ip,
    });

    if (response) {
      $.export("$summary", `Successfully looked up IP \`${this.ip}\``);
    }

    return response;
  },
};
