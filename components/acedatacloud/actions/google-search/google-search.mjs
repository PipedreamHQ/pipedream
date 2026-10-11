import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-google-search",
  name: "Search Google",
  description: "Search Google web, images, news, maps, places, or videos. [See the documentation](https://platform.acedata.cloud/documents/serp-google)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
    query: { type: "string", label: "Query", description: "Search query, e.g. `solar eclipse 2026`." },
    type: { type: "string", label: "Search Type", description: "Search vertical, e.g. `search` or `news`.", options: ["search", "images", "news", "maps", "places", "videos"], default: "search" },
    number: { type: "integer", label: "Results", description: "Number of results, e.g. `3`.", default: 3 },
    page: { type: "integer", label: "Page", description: "Result page, e.g. `1`.", default: 1 },
  },
  async run({ $ }) {
    if (!Number.isInteger(this.number) || this.number < 1 || this.number > 100) {
      throw new Error("Results must be between 1 and 100.");
    }
    if (!Number.isInteger(this.page) || this.page < 1 || this.page > 100) {
      throw new Error("Page must be between 1 and 100.");
    }
    const data = {
      query: requiredText(this.query, "Query"),
      type: this.type,
      number: this.number,
      page: this.page,
    };
    const response = await this.acedatacloud.request({
      $,
      path: "/serp/google",
      data,
    });
    $.export("$summary", "Search Google returned a response");
    return response;
  },
};
