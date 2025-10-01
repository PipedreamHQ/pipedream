import opengraph from "../../opengraph_io.app.mjs";

export default {
  key: "opengraph_io-scrape-url",
  name: "Scrape Url",
  description: "Retrieve OpenGraph data from a specified URL using the OpenGraph.io API. [See the docs here](https://www.opengraph.io/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    opengraph,
    url: {
      propDefinition: [
        opengraph,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.opengraph.getSiteInfo(this.url);

    $.export("$summary", `Successfully scraped data for site ${this.url}`);

    return response;
  },
};
