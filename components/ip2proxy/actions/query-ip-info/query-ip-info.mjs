import ip2proxyApp from "../../ip2proxy.app.mjs";
import { PACKAGE_OPTIONS } from "../../common/constants.mjs";

export default {
  name: "Query IP address",
  description: "Query IP address using IP2Proxy API. [See the docs here](https://www.ip2location.com/web-service/ip2proxy) for how to use this API.",
  key: "ip2proxy-query-ip-info",
  version: "0.0.1",
  type: "action",
  props: {
    ip2proxyApp,
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) for reverse IP location lookup purposes.",
    },
    pxPackage: {
      type: "string",
      label: "Package",
      options: PACKAGE_OPTIONS,
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
    const {
      ipAddress,
      format,
      pxPackage,
    } = this;
    const response =
      await this.ip2proxyApp.queryIPInfo({
        $,
        params: {
          format: format ?? "json",
          ip: ipAddress,
          package: pxPackage,
        },
      });
    $.export("$summary", "Successfully queried IP address information with IP2Proxy API.");
    return response;

  },
};
