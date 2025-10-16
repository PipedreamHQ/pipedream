import zenscrape from "../../zenscrape.app.mjs";

export default {
  key: "zenscrape-get-website-content",
  name: "Get Website Content",
  description: "Retrieve the content of a website. [See the documentation](https://app.zenscrape.com/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zenscrape,
    url: {
      propDefinition: [
        zenscrape,
        "url",
      ],
    },
    premium: {
      propDefinition: [
        zenscrape,
        "premium",
      ],
    },
    location: {
      propDefinition: [
        zenscrape,
        "location",
      ],
    },
    keepHeaders: {
      propDefinition: [
        zenscrape,
        "keepHeaders",
      ],
    },
    render: {
      propDefinition: [
        zenscrape,
        "render",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zenscrape.getContent({
      $,
      params: {
        url: this.url,
        premium: this.premium,
        location: this.location,
        keep_headers: this.keepHeaders,
        render: this.render,
      },
    });
    $.export("$summary", `Successfully scraped website \`${this.url}.\``);
    return response;
  },
};
