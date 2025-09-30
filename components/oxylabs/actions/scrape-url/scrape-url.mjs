import oxylabs from "../../oxylabs.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "oxylabs-scrape-url",
  name: "Scrape URL",
  description: "Scrape a URL. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    oxylabs,
    source: {
      type: "string",
      label: "Source",
      description: "Sets the scraper that will be used to process your request",
      options: constants.URL_SOURCES,
      default: "universal",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape",
    },
    geoLocation: {
      propDefinition: [
        oxylabs,
        "geoLocation",
      ],
    },
    parse: {
      propDefinition: [
        oxylabs,
        "parse",
      ],
    },
    render: {
      propDefinition: [
        oxylabs,
        "render",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.oxylabs.scrape({
      $,
      data: {
        source: this.source,
        url: this.url,
        geo_location: this.geoLocation,
        parse: this.parse,
        render: this.render,
      },
    });
    $.export("$summary", `Successfully scraped URL: ${this.url}`);
    return response;
  },
};
