import zenrows from "../../zenrows.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zenrows-scrape-url-css-selectors",
  name: "Scrape URL with CSS Selectors",
  description: "Extracts specific data from a given webpage using CSS selectors. [See the documentation](https://docs.zenrows.com/)",
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
    },
  },
  async run({ $ }) {
    const response = await this.zenrows.scrapeUrl({
      url: this.url,
      cssSelectors: this.cssSelectors,
    });

    $.export("$summary", `Successfully scraped the URL ${this.url} with the specified CSS selectors`);
    return response;
  },
};
