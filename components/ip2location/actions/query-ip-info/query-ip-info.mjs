import { axios } from "@pipedream/platform";

export default {
  name: "Query IP address",
  description: "Query IP address using IP2Location API.",
  key: "ip2location-query-ip-info",
  version: "0.0.1",
  type: "action",
  props: {
    ipl_api_key: {
      type: "app",
      app: "ip2location",
      description: "You can sign up for a trial key at [here](https://www.ip2location.com/register?id=1005).",
    },
    ip_address: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) for reverse IP location lookup purposes.",
    },
    package: {
      type: "string",
      label: "Package",
      description: "Web service package of different granularity of return information. Please refer to the pricing table in our [documentation](https://www.ip2location.com/web-service/ip2location) for the information returned. Valid value: `WS1` | `WS2` | `WS3` | `WS4` | `WS5` | `WS6` | `WS7` | `WS8` | `WS9` | `WS10` | `WS11` | `WS12` | `WS13` | `WS14` | `WS15` | `WS16` | `WS17` | `WS18` | `WS19` | `WS20` | `WS21` | `WS22` | `WS23` | `WS24` | `WS25`",
    },
    format: {
      type: "string",
      label: "Response Format",
      description: "Format of the response message. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Translation Language",
      description: "Translation information. The translation is only applicable for continent, country, region and city name for the **addon** package. Valid value: `ar` | `cs` | `da` | `de` | `en` | `es` | `et` | `fi` | `fr` | `ga` | `it` | `ja` | `ko` | `ms` | `nl` | `pt` | `ru` | `sv` | `tr` | `vi` | `zh-cn` | `zh-tw`",
      optional: true,
    },
    addon: {
      type: "string",
      label: "Addon",
      description: "Extra information in addition to the above-selected package. Please refer to the pricing table in our [documentation](https://www.ip2location.com/web-service/ip2location) for the information returned. You can query for multiple addons by putting a comma at between of them, for example `continent,country`. Valid value: `continent`, `country`, `region`, `city`, `geotargeting`, `country_groupings`, `time_zone_info`",
      optional: true,
    }
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.ip2location.com/v2/`,
      params: {
        key: `${this.ipl_api_key.$auth.api_key}`,
        format: (typeof this.format === "undefined") ? "json" :`${this.format}`,
        language: (typeof this.language === "undefined") ? "en" :`${this.language}`,
        ip: `${this.ip_address}`,
        package: `${this.package}`,
        addon: (typeof this.addon === "undefined") ? "" :`${this.addon}`,
      },
    })
  },
}