import app from "../../klazify.app.mjs";

export default {
  key: "klazify-get-media-links-scraper",
  name: "Get Media Links Scraper",
  description: "Get the media links of a domain. [See the documentation](https://www.klazify.com/category#docs).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    getMediaLinksScraper(args = {}) {
      return this.app.post({
        path: "/domain_social_media",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getMediaLinksScraper({
      step,
      data: {
        url: this.url,
      },
    });

    step.export("$summary", `Successfully retrieved media links for ${this.url}`);

    return response;
  },
};
