import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-scrape-web-page",
  name: "Scrape Web Page",
  description: "Fetch a web page as clean Markdown. [See the documentation](https://groundsocial.dev/docs/api/web-scrape-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The page to fetch, e.g. `https://example.com`",
    },
  },
  async run({ $ }) {
    const response = await this.app.callEndpoint({
      $,
      endpointId: "web.scrape.get",
      params: {
        url: this.url,
      },
    });
    $.export("$summary", `Successfully scraped ${this.url}`);
    return response;
  },
};
