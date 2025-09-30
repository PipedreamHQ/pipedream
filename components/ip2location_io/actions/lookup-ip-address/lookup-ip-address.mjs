import ip2location from "../../ip2location_io.app.mjs";

export default {
  key: "ip2location_io-lookup-ip-address",
  name: "Lookup IP Address",
  description: "Retrieve geolocation data about an IP Address. [See the docs here](https://www.ip2location.io/ip2location-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    lang: {
      type: "string",
      label: "Language",
      description: "Translation information(ISO639-1). The translation is only applicable for continent, country, region and city name. Note: This parameter is only available for Plus and Security plan only.",
      options: [
        "ar",
        "cs",
        "da",
        "de",
        "en",
        "es",
        "et",
        "fi",
        "fr",
        "ga",
        "it",
        "ja",
        "ko",
        "ms",
        "nl",
        "pt",
        "ru",
        "sv",
        "tr",
        "vi",
        "zh-cn",
        "zh-tw",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ip2location.lookupIpAddress({
      params: {
        ip: this.ip,
        format: this.format,
        lang: this.lang,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved information about IP ${this.ip}.`);
    }

    return response;
  },
};
