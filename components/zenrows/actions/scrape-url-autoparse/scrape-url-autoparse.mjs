import app from "../../zenrows.app.mjs";

export default {
  name: "Scrape URL Autoparse",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zenrows-scrape-url-autoparse",
  description: "Scrape HTML of the URL. [See the documentation](https://www.zenrows.com/docs#autoparse-curl)",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scrapeUrl({
      $,
      params: {
        url: this.url,
        autoparse: true,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved HTML from URL \`${this.url}\``);
    }

    return response;
  },
};
