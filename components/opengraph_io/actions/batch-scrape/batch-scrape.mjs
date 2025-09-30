import opengraph from "../../opengraph_io.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "opengraph_io-batch-scrape",
  name: "Batch Scrape",
  description: "Scrape OpenGraph data from a list of URLs at once, to process multiple websites simultaneously. [See the docs here](https://www.opengraph.io/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    opengraph,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Array of URLs to scrape",
    },
    properties: {
      propDefinition: [
        opengraph,
        "properties",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      urls,
      properties,
    } = this;

    if (!(urls?.length > 0)) {
      throw new ConfigurationError("Must enter at least one URL.");
    }

    const results = [];

    for (const url of urls) {
      const { openGraph } = await this.opengraph.getSiteInfo(url);
      if (properties?.length > 0) {
        const result = {};
        for (const property of properties) {
          result[property] = openGraph[property];
        }
        results.push(result);
        continue;
      }
      results.push(openGraph);
    }

    $.export("$summary", `Successfully scraped ${results.length} site(s).`);

    return results;
  },
};
