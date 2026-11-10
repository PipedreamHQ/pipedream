import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-website-technology",
  name: "Get Website Technology",
  description: "Detect the technologies a website runs, such as its CMS, frameworks, analytics, CDN and hosting, with a version and a confidence score for each. Use **Get Website Crawler** to read the page itself. [See the documentation](https://docs.piloterr.com/v2/api-reference/website/technology)",
  version: "0.0.3",
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
      label: "Website URL",
      description: "The URL of the website to inspect, e.g. `https://example.com`.",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getWebsiteTechnology({
      $,
      params: {
        query: this.url,
      },
    });
    $.export("$summary", `Retrieved ${response.technologies?.length ?? 0} technologies for ${this.url}`);
    return response;
  },
};
