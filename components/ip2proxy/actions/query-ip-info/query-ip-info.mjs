import { axios } from "@pipedream/platform";

export default {
  name: "Query IP address",
  description: "Query IP address using IP2Proxy API.",
  key: "ip2proxy-query-ip-info",
  version: "0.0.1",
  type: "action",
  props: {
    ipl_api_key: {
      type: "app",
      app: "ip2proxy",
      description: "You can sign up for a trial key at [here](https://www.ip2location.com/register?id=1006).",
    },
    ip_address: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) for reverse IP location lookup purposes.",
    },
    package: {
      type: "string",
      label: "Package",
      description: "Web service package of different granularity of return information. Please refer to the pricing table in our [documentation](https://www.ip2location.com/web-service/ip2proxy) for the information returned. Valid value: `PX1` | `PX2` | `PX3` | `PX4` | `PX5` | `PX6` | `PX7` | `PX8` | `PX9` | `PX10` | `PX11`.",
    },
    format: {
      type: "string",
      label: "Response Format",
      description: "Format of the response message. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.ip2proxy.com/`,
      params: {
        key: `${this.ipl_api_key.$auth.api_key}`,
        format: (typeof this.format === "undefined") ? "json" :`${this.format}`,
        ip: `${this.ip_address}`,
        package: `${this.package}`,
      },
    })
  },
}