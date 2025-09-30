import webscraper from "../../webscraper_io.app.mjs";

export default {
  key: "webscraper_io-create-sitemap",
  name: "Create Sitemap",
  description: "Creates a sitemap for the selected website. [See the docs here](https://webscraper.io/documentation/web-scraper-cloud/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    webscraper,
    sitemap: {
      type: "string",
      label: "Sitemap Name",
      description: "A string identifier for the sitemap, such as `webscraper-io-test-site`",
    },
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The root URL of the website to create a sitemap of",
    },
  },
  async run({ $ }) {
    const response = await this.webscraper.createSitemap({
      data: {
        _id: this.sitemap,
        startUrl: [
          this.startUrl,
        ],
        selectors: [
          {
            parentSelectors: [
              "_root",
            ],
            type: "SelectorText",
            multiple: false,
            id: "title",
            selector: "h1",
            regex: "",
            delay: "",
          },
        ],
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created sitemap with ID: ${response.data.id}`);
    }

    return response;
  },
};
