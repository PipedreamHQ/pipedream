import ip2location from "../../ip2location_io.app.mjs";

export default {
  key: "ip2location_io-lookup-ip-address",
  name: "Lookup IP Address",
  description: "Retrieve geolocation data about an IP Address. [See the docs here](https://www.ip2location.io/ip2location-documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ip2location,
    ip: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) to lookup",
    },
    format: {
      propDefinition: [
        ip2location,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ip2location.lookupIpAddress({
      params: {
        ip: this.ip,
        format: this.format,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved information about IP ${this.ip}.`);
    }

    return response;
  },
};
