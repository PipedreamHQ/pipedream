import brightData from "../../bright_data.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bright_data-scrape-serp",
  name: "Scrape SERP",
  description: "Extract search engine results using Bright Data SERP API. [See the documentation](https://docs.brightdata.com/api-reference/rest-api/serp/scrape-serp)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    brightData,
    url: {
      propDefinition: [
        brightData,
        "url",
      ],
      description: "Complete target URL to scrape. Must include protocol (http/https), be publicly accessible. Example: `https://www.google.com/search?q=pizza`",
    },
    zone: {
      propDefinition: [
        brightData,
        "zone",
        () => ({
          type: "serp",
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

    if (data.status_code === 400) {
      throw new ConfigurationError(data.body);
    }

    $.export("$summary", `Scraped SERP for ${this.url}`);
    return data;
  },
};
