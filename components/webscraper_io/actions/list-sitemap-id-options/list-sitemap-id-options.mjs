import webscraper_io from "../../webscraper_io.app.mjs";

export default {
  key: "webscraper_io-list-sitemap-id-options",
  name: "List Sitemap ID Options",
  description: "Retrieves available options for the Sitemap ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    webscraper_io,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await webscraper_io.propDefinitions.sitemapId.options.call(this.webscraper_io, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
