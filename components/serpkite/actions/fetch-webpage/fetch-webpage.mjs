import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-fetch-webpage",
  name: "Fetch Webpage",
  description: "Fetch a public HTML page or PDF and return its main content as clean Markdown with metadata. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/webpage)",
  version: "0.0.2",
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
      type: "string",
      label: "Country",
      description: "Fetch through this country, such as `de`, for pages that differ by location.",
      optional: true,
    },
    includeLinks: {
      type: "boolean",
      label: "Include Links",
      description: "Also return the page's links.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/webpage",
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
