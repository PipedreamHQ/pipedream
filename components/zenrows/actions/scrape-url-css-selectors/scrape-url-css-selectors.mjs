import app from "../../zenrows.app.mjs";

export default {
  name: "Scrape URL CSS Selectors",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zenrows-scrape-url-css-selectors",
  description: "Scrape HTML of the URL with CSS Selectors. [See the documentation](https://www.zenrows.com/docs#css-selectors-curl)",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    cssExtractor: {
      type: "string",
      label: "CSS Selectors",
      description: "CSS Selectors for data extraction. E.g. `{\"links\":\"a @href\", \"images\":\"img @src\"}`",
    },
  },
  async run({ $ }) {
    const response = await this.app.scrapeUrl({
      $,
      params: {
        url: this.url,
        css_extractor: this.cssExtractor,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved HTML from URL \`${this.url}\``);
    }

    return response;
  },
};
