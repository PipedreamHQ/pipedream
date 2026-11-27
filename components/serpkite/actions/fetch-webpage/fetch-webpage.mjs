import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-fetch-webpage",
  name: "Fetch Webpage",
  description: "Fetch a public HTML page or PDF and return its main content as clean Markdown with metadata. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/webpage)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      description: "Fetch the page as seen from this country (two-letter ISO 3166-1 alpha-2 code), for pages that differ by location, e.g. `de`.",
    },
    includeLinks: {
      type: "boolean",
      label: "Include Links",
      description: "Also return the page's links in `links`, e.g. `true`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchWebpage({
      $,
      data: {
        url: this.url,
        country: this.country,
        include_links: this.includeLinks,
      },
    });
    $.export("$summary", "Fetched webpage as Markdown");
    return response;
  },
};
