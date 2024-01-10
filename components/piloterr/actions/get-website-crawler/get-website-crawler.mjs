import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-website-crawler",
  name: "Get Website Crawler",
  description: "Obtains HTML from a given website through web scraping for high performance access and interpretation. [See the documentation](https://docs.piloterr.com/v2/api-reference/website/crawler)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    piloterr,
    websiteUrl: {
      propDefinition: [
        piloterr,
        "websiteUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.scrapeWebsite({
      path: `/website/crawler?website_url=${this.websiteUrl}`,
    });
    $.export("$summary", `Successfully obtained HTML from ${this.websiteUrl}`);
    return response;
  },
};
