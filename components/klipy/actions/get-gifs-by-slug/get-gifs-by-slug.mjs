import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-get-gifs-by-slug",
  name: "Get GIFs by Slug",
  description: "Identify user-viewed content and recommend tailored content to the same user. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    slug: {
      propDefinition: [
        klipy,
        "viewGifsSlug",
      ],
    },
    customerId: {
      propDefinition: [
        klipy,
        "viewGifsCustomerId",
      ],
    },
    searchQuery: {
      propDefinition: [
        klipy,
        "searchGifsQ",
      ],
    },
  },
  async run({ $ }) {
    // Trigger the view action for the specified GIF
    await this.klipy.viewGifs();

    // Search for tailored GIFs based on the provided query
    const recommendations = await this.klipy.searchGifs();

    // Export a summary of the actions performed
    $.export(
      "$summary",
      `Viewed GIF with slug '${this.slug}' for customer '${this.customerId}' and retrieved ${recommendations.length} recommendations.`,
    );

    // Return the recommendations
    return recommendations;
  },
};
