import zenrows from "../../zenrows.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zenrows-scrape-url-autoparse",
  name: "Scrape URL with Autoparse",
  description: "Extracts data from a given webpage and returns it in JSON format. Suitable for the most popular websites. [See the documentation](https://docs.zenrows.com/reference/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zenrows,
    url: {
      propDefinition: [
        zenrows,
        "url",
      ],
    },
    cssSelectors: {
      propDefinition: [
        zenrows,
        "cssSelectors",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zenrows.scrapeUrl({
      url: this.url,
      cssSelectors: this.cssSelectors,
    });
    $.export("$summary", `Successfully scraped data from URL: ${this.url}`);
    return response;
  },
};
