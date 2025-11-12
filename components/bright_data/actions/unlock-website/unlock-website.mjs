import brightData from "../../bright_data.app.mjs";

export default {
  key: "bright_data-unlock-website",
  name: "Unlock Website",
  description: "Send an API call to a URL and get the HTML back. Enables you to bypass anti-bot measures, manages proxies, and solves CAPTCHAs automatically for easier web data collection. [See the documentation](https://docs.brightdata.com/api-reference/rest-api/unlocker/unlock-website)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    brightData,
    url: {
      propDefinition: [
        brightData,
        "url",
      ],
    },
    zone: {
      propDefinition: [
        brightData,
        "zone",
        () => ({
          type: "unblocker",
        }),
      ],
    },
    format: {
      propDefinition: [
        brightData,
        "format",
      ],
    },
    method: {
      propDefinition: [
        brightData,
        "method",
      ],
    },
    country: {
      propDefinition: [
        brightData,
        "country",
      ],
    },
    dataFormat: {
      propDefinition: [
        brightData,
        "dataFormat",
      ],
    },
  },
  async run({ $ }) {
    const data = await this.brightData.requestWebsite({
      $,
      data: {
        url: this.url,
        zone: this.zone,
        format: this.format,
        method: this.method,
        country: this.country,
        data_format: this.dataFormat,
      },
    });

    $.export("$summary", `Unlocked website ${this.url}`);
    return data;
  },
};
