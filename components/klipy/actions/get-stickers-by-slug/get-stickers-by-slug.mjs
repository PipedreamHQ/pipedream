import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-get-stickers-by-slug",
  name: "Get Stickers By Slug",
  description: "Identifies user-viewed content and recommends tailored content. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    slug: {
      propDefinition: [
        "klipy",
        "viewStickersSlug",
      ],
      label: "Slug",
      description: "The slug of the sticker to identify as viewed.",
    },
    customer_id: {
      propDefinition: [
        "klipy",
        "viewStickersCustomerId",
      ],
      label: "Customer ID",
      description: "A unique user identifier in your system.",
    },
  },
  async run({ $ }) {
    // Log that the user has viewed the sticker
    await this.klipy.viewStickers();

    // Recommend tailored content based on the viewed sticker
    const recommendations = await this.klipy._makeRequest({
      method: "GET",
      path: "/api/v1/stickers/search",
      params: {
        q: this.slug,
        customer_id: this.customer_id,
        page: 1,
        per_page: 24,
      },
    });

    // Export a summary for the user
    $.export("$summary", `Fetched ${recommendations.length} tailored sticker recommendations for customer ID ${this.customer_id}.`);

    // Return the recommended stickers
    return recommendations;
  },
};
