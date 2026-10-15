import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-fetch-webpage",
  name: "Fetch Webpage",
  description: "Fetch a public HTML or PDF URL as clean Markdown with SerpKite. [See the documentation](https://serpkite.com/docs/endpoints/webpage)",
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
      type: "string",
      label: "URL",
      description: "The public HTTP or HTTPS URL to fetch.",
    },
  },
  async run({ $ }) {
    const response = await this.app.webpage({
      $,
      data: {
        url: this.url,
      },
    });
    $.export("$summary", "Fetched webpage as Markdown");
    return response;
  },
};
