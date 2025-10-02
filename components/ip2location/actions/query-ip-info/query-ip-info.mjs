import ip2locationApp from "../../ip2location.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Query IP address",
  description: "Query IP address using IP2Location API. [See the docs here](https://www.ip2location.com/web-service/ip2location) for how to use this API.",
  key: "ip2location-query-ip-info",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ip2locationApp,
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) for reverse IP location lookup purposes.",
    },
    wsPackage: {
      type: "string",
      label: "Package",
      options: constants.PACKAGE_OPTIONS,
      description: "Web service package of different granularity of return information. Please refer to the pricing table in our [documentation](https://www.ip2location.com/web-service/ip2location) for the information returned.",
    },
    format: {
      type: "string",
      label: "Response Format",
      options: constants.FORMAT_OPTIONS,
      description: "Format of the response message. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Translation Language",
      options: constants.LANGUAGE_OPTIONS,
      description: "Translation information. The translation is only applicable for continent, country, region and city name for the **addon** package.",
      optional: true,
    },
    addon: {
      type: "string[]",
      label: "Addon",
      options: constants.ADDON_OPTIONS,
      description: "Extra information in addition to the above-selected package. Please refer to the pricing table in our [documentation](https://www.ip2location.com/web-service/ip2location) for the information returned. You can query for multiple addons by putting a comma at between of them, for example `continent,country`. Valid value: `continent`, `country`, `region`, `city`, `geotargeting`, `country_groupings`, `time_zone_info`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ipAddress,
      format,
      language,
      wsPackage,
      addon,
    } = this;
    var addon_formatted = "";
    for (let i = 0; i < addon.length; i++) {
      addon_formatted += addon[i] + ",";
    }
    const response =
      await this.ip2locationApp.queryIPInfo({
        $,
        params: {
          format: format ?? "json",
          language: language ?? "en",
          ip: ipAddress,
          package: wsPackage,
          addon: addon_formatted ?? "",
        },
      });
    $.export("$summary", "Successfully queried IP address information with IP2Location API.");
    return response;
  },
};
