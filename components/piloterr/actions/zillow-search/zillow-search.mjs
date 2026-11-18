import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-zillow-search",
  name: "Zillow Search",
  description: "Search Zillow listings from a Zillow search or map URL and return their price, Zestimate, beds, baths, area, address, coordinates and status. Use **Get Zillow Property** with a returned `detail_url` for the full property. [See the documentation](https://docs.piloterr.com/v2/api-reference/zillow/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    url: {
      type: "string",
      label: "Search URL",
      description: "A Zillow search or map results URL; its filters and page are kept, e.g. `https://www.zillow.com/staten-island-ny/`.",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.searchZillow({
      $,
      params: {
        query: this.url,
      },
    });
    $.export("$summary", `Found ${response.results?.length ?? 0} Zillow listings`);
    return response;
  },
};
