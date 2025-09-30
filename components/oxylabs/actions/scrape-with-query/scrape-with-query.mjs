import oxylabs from "../../oxylabs.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "oxylabs-scrape-with-query",
  name: "Scrape with Query",
  description: "Extract data using a search query. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    oxylabs,
    source: {
      type: "string",
      label: "Source",
      description: "Sets the scraper that will be used to process your request",
      options: constants.QUERY_SOURCES,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/targets) for more information about specific sources/targets",
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
        query: this.query,
        geo_location: this.geoLocation,
        parse: this.parse,
        render: this.render,
      },
    });
    $.export("$summary", `Successfully scraped using query: ${this.query}`);
    return response;
  },
};
