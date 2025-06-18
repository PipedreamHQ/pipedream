import oxylabs from "../../oxylabs.app.mjs";

export default {
  key: "oxylabs-scrape-url",
  name: "Scrape URL",
  description: "Scrape a URL. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    oxylabs,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape",
    },
    geoLocation: {
      type: "string",
      label: "Geo Location",
      description: "The geo locatio to scrape from. E.g. `United States`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.oxylabs.scrapeUrl({
      $,
      data: {
        source: "universal",
        url: this.url,
        geo_location: this.geoLocation,
      },
    });
    $.export("$summary", `Successfully scraped URL: ${this.url}`);
    return response;
  },
};
